import { Injectable } from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {MessageUIService} from "../UI/message-ui.service";
import {ConfigService} from "../config/config.service";
import {WebsiteConfig} from "../../models/config/website-config";
import {HelperServiceService} from "../helper/helper-service.service";
import {UserToken} from "../../models/DTO/user-token";
import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import {ApiRep} from "../../models/api/api-rep";
import {promise} from "protractor";
import {Base64} from "js-base64";
import {UserSM2Binding} from "../../models/entity/user-s-m2-binding";
import {FIDO2Item} from "../../models/DTO/fido2/fido2-item";
import {LogUtil} from "../../shared/utils/log-util";
import {LogService} from "../Log/log.service";
import {ALLOW_ANONYMOUS} from "@delon/auth";

@Injectable({
  providedIn: 'root'
})
export class Fido2Service {
  config: WebsiteConfig;
  userToken:UserToken;


  constructor( private messageUI: MessageUIService,
               public http: HttpClient,
               public configService: ConfigService,
               public logService:LogService,
               public helperService: HelperServiceService) {

    this.config = this.configService.GetWebSiteConfig();
    this.userToken=this.configService.GetUserToken();

  }
  /**
   * 注册请求
   */
  async handleRegisterSubmit(keyName:string) {



    // prepare form post data
    var formData = new FormData();

    formData.append('token',this.userToken.Token);
    // send to server for registering
    let makeCredentialOptions;
    try {
      //请求fido2注册选项
      makeCredentialOptions = await this.fetchMakeCredentialOptions(formData);
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

    //this.helperService.ShowInfoMessage('Tap your security key to finish registration');

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
  /**
   * 请求FIDO2断言 请求fido2登录断言
   * @param email
   */
  async getAssertionOptions(email:string):Promise<Credential | null | undefined > {
    return new Promise<Credential | null | undefined >(async resolve => {
      let urlCreateAssertionOptions = this.config.baseURL + '/api/fido2/CreateAssertionOptions';
      // prepare form post data
      let formData = new FormData();
      formData.append('email', email);

      // send to server for registering
      let makeAssertionOptions;
      try {
        let url = this.config.baseURL + '/api/fido2/CreateAssertionOptions';
        let formData = new FormData();
        formData.set("email", email);

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

     // this.messageUI.ShowInfoMessage('Tap your security key to login');

      // ask browser for credentials (browser will ask connected authenticators)
      let credential;
      try {
        credential = await navigator.credentials.get({publicKey: makeAssertionOptions});
      } catch (err:any) {
        this.logService.error(err.toString())
        this.messageUI.ShowErrorMessage('error');
      }
        resolve(credential);
    })

  }
  async verifyTheAssertionResponse(email:string,assertedCredential: any):Promise<UserToken|null>{
    LogUtil.log("verifyTheAssertionResponse is start")
    return  new Promise<UserToken|null>(resolve => {
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
          clientDataJSON: this.coerceToBase64Url(clientDataJSON),
          signature: this.coerceToBase64Url(sig)
        }
      };
      console.log("verifyTheAssertionResponse");
      console.log(data);
      let url = this.config.baseURL + '/api/fido2/VerifyTheAssertionResponse';
      let formData = new FormData();
      formData.set('email', email);
      formData.set('data', Base64.encode(JSON.stringify(data)));
      let result=this.http.post<ApiRep>(url,formData,{context:new HttpContext().set(ALLOW_ANONYMOUS, true) }).subscribe(apiRe=>
      {
        if (apiRe!=null&& apiRe.Ok){
          let userToken=apiRe.Data as UserToken;
          resolve(userToken);
        }else {
          resolve(null);
        }

      })

    })
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
  //==========================================================

  public async  List(userId:string):Promise<Array<FIDO2Item>>{
    return  new Promise<Array<FIDO2Item>>((resolve)=>{

      let url = this.config.baseURL + '/api/fido2/List';
      let httpParams = new HttpParams()
        .append('userId', userId)
      let result = this.http.get<ApiRep>(url, {params: httpParams});
      result.subscribe(apiRe => {
        if (apiRe.Ok){
          let arr=apiRe.Data as Array<FIDO2Item>;
          resolve(arr);
        }
        let arr=new Array<FIDO2Item>();
        resolve(arr);
      });

    })
  }

  public async  Delete(keyId:string):Promise<ApiRep>{
    return  new Promise<ApiRep>((resolve)=>{

      let url = this.config.baseURL + '/api/fido2/Delete';
      let httpParams = new HttpParams()
        .append('keyId', keyId)
        .append('token', this.userToken.Token!)
      let result = this.http.delete<ApiRep>(url, {params: httpParams});
      result.subscribe(apiRe => {
        resolve(apiRe);
      });
    })
  }
  public async  SetFIDO2Name(keyId:string,fido2Name:string):Promise<ApiRep>{
    return  new Promise<ApiRep>((resolve)=>{
      let url = this.config.baseURL + '/api/fido2/FIDO2Name';
      let formData = new FormData();
      formData  .set('keyId', keyId)
      formData.set('token', this.userToken.Token!)
      formData .set('fido2Name', fido2Name)
      let result = this.http.post<ApiRep>(url, formData);
      result.subscribe(apiRe => {
        resolve(apiRe);
      });
    })
  }
  public async  Find(keyId:string):Promise<UserSM2Binding>{
    return  new Promise<FIDO2Item>((resolve)=>{
      let url = this.config.baseURL + '/api/fido2/Find';
      let httpParams = new HttpParams()
        .append('keyId', keyId)

      let result = this.http.get<ApiRep>(url, {params: httpParams});
      result.subscribe(apiRe => {
        resolve(apiRe.Data);
      });
    })
  }
}
