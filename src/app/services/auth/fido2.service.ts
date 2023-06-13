import { Injectable } from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {MessageUIService} from "../UI/message-ui.service";
import {ConfigService} from "../config/config.service";
import {WebsiteConfig} from "../../models/config/website-config";
import {HelperServiceService} from "../helper/helper-service.service";
import {UserToken} from "../../models/DTO/user-token";

@Injectable({
  providedIn: 'root'
})
export class Fido2Service {
  config: WebsiteConfig;
  userToken:UserToken;
  constructor( private messageUI: MessageUIService,
               public configService: ConfigService,
               public helperService: HelperServiceService) {

    this.config = this.configService.GetWebSiteConfig();
    this.userToken=this.configService.GetUserToken();
  }
  /**
   * 注册请求
   */
  async handleRegisterSubmit(keyName:string) {
    let username = this.userToken.Username;
    let displayName =  this.userToken.Username;

    // possible values: none, direct, indirect
    let attestation_type = 'none';
    // possible values: <empty>, platform, cross-platform
    let authenticator_attachment = '';

    // possible values: preferred, required, discouraged
    let user_verification = 'preferred';

    // possible values: true,false
    let require_resident_key = 'false';


    // prepare form post data
    var data = new FormData();
    data.append('username', username);
    data.append('displayName', displayName);
    data.append('attType', attestation_type);
    data.append('authType', authenticator_attachment);
    data.append('userVerification', user_verification);
    data.append('requireResidentKey', require_resident_key);
    data.append('token',this.userToken.Token);
    data.append('userId', this.userToken.UserId!);

    // send to server for registering
    let makeCredentialOptions;
    try {
      //请求fido2注册选项
      makeCredentialOptions = await this.fetchMakeCredentialOptions(data);
    } catch (e) {
      console.error(e);
      let msg = "Something wen't really wrong";
      this.helperService.ShowErrorMessage(msg);
    }

    console.log('Credential Options Object', makeCredentialOptions);

    if (makeCredentialOptions.status != 'ok') {
      console.log('Error creating credential options');
      console.log(makeCredentialOptions.errorMessage);
      this.helperService.ShowErrorMessage(makeCredentialOptions.errorMessage);
      return;
    }

    // Turn the challenge back into the accepted format of padded base64
    makeCredentialOptions.challenge = this.helperService.coerceToArrayBuffer(makeCredentialOptions.challenge);
    // Turn ID into a UInt8Array Buffer for some reason
    makeCredentialOptions.user.id = this.helperService.coerceToArrayBuffer(makeCredentialOptions.user.id);

    makeCredentialOptions.excludeCredentials = makeCredentialOptions.excludeCredentials.map((c: any) => {
      c.id = this.helperService.coerceToArrayBuffer(c.id);
      return c;
    });

    if (makeCredentialOptions.authenticatorSelection.authenticatorAttachment === null)
      makeCredentialOptions.authenticatorSelection.authenticatorAttachment = undefined;

    console.log('Credential Options Formatted', makeCredentialOptions);

    this.helperService.ShowInfoMessage('Tap your security key to finish registration');

    console.log('Creating PublicKeyCredential...');

    let newCredential;
    try {

      newCredential = await navigator.credentials.create({
        publicKey: makeCredentialOptions
      });
    } catch (e) {
      var msg =  '😟Could not create credentials in browser. Probably because the username is already registered with your authenticator. Please change username or authenticator.<br>';

      console.error(msg,e);
      this.helperService.ShowErrorMessage(msg);
    }

    console.log('😊PublicKeyCredential Created', newCredential);
    try {
      await this.registerNewCredential(newCredential,keyName);
      console.log('😊PublicKeyCredential Success');
    } catch (e) {
      this.helperService.ShowErrorMessage('registerNewCredential is error');
    }
  }

  async fetchMakeCredentialOptions(formData: any) {
    console.log("fetchMakeCredentialOptions")

    let response = await fetch(`${this.config.baseURL}/api/fido2/makeCredentialOptions`, {
      method: 'POST', // or 'PUT'
      body: formData, // data can be `string` or {object}!
      headers: {
        Accept: 'application/json'
      }
    });

    let data = await response.json();

    return data;
  }



  async registerCredentialWithServer(formData: any) {

    let response = await fetch(`${this.config.baseURL}/api/fido2/RegisterCredentials`, {
      method: 'POST', // or 'PUT'
      body: formData, // data can be `string` or {object}!
      headers: {
        Accept: 'application/json'
      }
    });

    let data = await response.json();

    return data;
  }

  /**
   * 发送到服务器，服务器验证通过后，注册成功
   * @param newCredential 新的证书材料
   * @param keyName key注册名称
   */
  async registerNewCredential(newCredential: any,keyName:string) {


    // Move data into Arrays incase it is super long
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    const attestationResponse = {
      id: newCredential.id,
      token:this.userToken.Token,
      rawId: this.helperService.coerceToBase64Url(rawId),
      type: newCredential.type,
      extensions: newCredential.getClientExtensionResults(),
      response: {
        attestationObject: this.helperService.coerceToBase64Url(attestationObject),
        clientDataJSON: this.helperService.coerceToBase64Url(clientDataJSON)
      }
    };

    console.log('😊attestationObject')
    console.log(attestationObject)

    console.log('😊This should be used to verify the auth data with the server')
    console.log(newCredential)

    let fromData=new FormData();
    fromData.append('token',this.userToken.Token);
    fromData.append('data',JSON.stringify(attestationResponse));
    fromData.append('KeyName',keyName);
    console.log("😊registerCredentialWithServer")
    console.log(attestationResponse)

    let response;
    try {
      //注册
      response = await this.registerCredentialWithServer(fromData);
    } catch (e) {
      this.helperService.ShowErrorMessage('registerCredentialWithServer is error');
    }

    console.log('Credential Object', response);

    // show error
    if (response.status !== 'ok') {
      console.log('Error creating credential');
      console.log(response.errorMessage);
      this.helperService.ShowErrorMessage(response.errorMessage);
      return;
    }

    // show success
    this.helperService.ShowSuccess("You've registered successfully.");

    // redirect to dashboard?
    //window.location.href = "/dashboard/" + state.user.displayName;
  }




  //-----------------------------------------------------
  async handleSignInSubmit(username:string) {
    let urlCreateAssertionOptions = this.config.baseURL + '/api/fido2/CreateAssertionOptions';
    // prepare form post data
    let formData = new FormData();
    formData.append('username', username);

    // send to server for registering
    let makeAssertionOptions;
    try {
      let res = await fetch(urlCreateAssertionOptions, {
        method: 'POST', // or 'PUT'
        body: formData, // data can be `string` or {object}!
        headers: {
          Accept: 'application/json'
        }
      });

      makeAssertionOptions = await res.json();
    } catch (e) {
      this.messageUI.ShowErrorMessage('Request to server failed');
    }

    console.log('Assertion Options Object', makeAssertionOptions);

    // show options error to user
    if (makeAssertionOptions.status !== 'ok') {
      console.log('Error creating assertion options');
      console.log(makeAssertionOptions.errorMessage);
      this.messageUI.ShowErrorMessage(makeAssertionOptions.errorMessage);
      return;
    }

    // todo: switch this to coercebase64
    const challenge = makeAssertionOptions.challenge.replace(/-/g, '+').replace(/_/g, '/');
    makeAssertionOptions.challenge = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

    // fix escaping. Change this to coerce
    makeAssertionOptions.allowCredentials.forEach((listItem: any) => {
      let fixedId = listItem.id.replace(/\_/g, '/').replace(/\-/g, '+');
      listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
    });

    console.log('Assertion options', makeAssertionOptions);

    this.messageUI.ShowInfoMessage('Tap your security key to login');

    // ask browser for credentials (browser will ask connected authenticators)
    let credential;
    try {
      credential = await navigator.credentials.get({publicKey: makeAssertionOptions});
    } catch (err) {
      this.messageUI.ShowErrorMessage('error');
    }

    try {
      await this.verifyAssertionWithServer(credential);
    } catch (e) {
      this.messageUI.ShowErrorMessage('Could not verify assertion');
    }
  }

  async verifyAssertionWithServer(assertedCredential: any) {
    // Move data into Arrays incase it is super long
    let authData = new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    const data = {
      id: assertedCredential.id,
      rawId: this.coerceToBase64Url(rawId),
      type: assertedCredential.type,
      extensions: assertedCredential.getClientExtensionResults(),
      response: {
        authenticatorData: this.coerceToBase64Url(authData),
        clientDataJson: this.coerceToBase64Url(clientDataJSON),
        signature: this.coerceToBase64Url(sig)
      }
    };


    let response;
    try {
      let res = await fetch('/makeAssertion', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      response = await res.json();
    } catch (e) {
      this.messageUI.ShowErrorMessage('Request to server failed');
      throw e;
    }

    console.log('Assertion Object', response);

    // show error
    if (response.status !== 'ok') {
      console.log('Error doing assertion');
      console.log(response.errorMessage);
      this.messageUI.ShowErrorMessage(response.errorMessage);
      return;
    }

    // show success message

    this.messageUI.ShowInfoMessage("You're logged in successfully.");
  }
  //==========================================================
  coerceToBase64Url(thing: any): any {
    // Array or ArrayBuffer to Uint8Array
    if (Array.isArray(thing)) {
      thing = Uint8Array.from(thing);
    }

    if (thing instanceof ArrayBuffer) {
      thing = new Uint8Array(thing);
    }

    // Uint8Array to base64
    if (thing instanceof Uint8Array) {
      let str = '';
      let len = thing.byteLength;

      for (let i = 0; i < len; i++) {
        str += String.fromCharCode(thing[i]);
      }
      thing = window.btoa(str);
    }

    if (typeof thing !== 'string') {
      throw new Error('could not coerce to string');
    }
    // base64 to base64url
    // NOTE: "=" at the end of challenge is optional, strip it off here
    thing = thing.replace(/\+/g, '-').replace(/\//g, '_').replace(/=*$/g, '');

    return thing;
  }
}
