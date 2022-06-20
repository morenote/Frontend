import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';

import {AuthService} from '../../../../../services/auth/auth.service';
import {HelperServiceService} from '../../../../../services/helper/helper-service.service';
import {ConfigService} from "../../../../../services/config/config.service";
import {WebsiteConfig} from "../../../../../models/config/website-config";
import {_HttpClient} from "@delon/theme";
import {UserToken} from "../../../../../models/DTO/user-token";
import {
  LoginSecurityPolicyLevel
} from "../../../../../models/enum/LoginSecurityPolicyLevel/login-security-policy-level";
import {SelectMoalComponent} from "../../../../../my-components/MyModal/select-moal/select-moal.component";
import {
  LoginSecurityPolicyLevelConvert
} from "../../../../../models/enum/LoginSecurityPolicyLevel/login-security-policy-level-convert";
import {
  ChangePassWordModalComponentComponent
} from "../../../../../my-components/MyModal/change-pass-word-modal-component/change-pass-word-modal-component.component";
import {UserService} from "../../../../../services/User/user.service";

@Component({
  selector: 'app-account-settings-security',
  templateUrl: './security.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProAccountSettingsSecurityComponent {

  public config: WebsiteConfig ;
  userToken!:UserToken;


  @ViewChild("app_select_moal")
  app_select_moal!:SelectMoalComponent;
  @ViewChild("app_change_user_passwd")
  app_change_user_passwd!:ChangePassWordModalComponentComponent;

  constructor(public authService: AuthService,
              public userService:UserService,
              private cdr: ChangeDetectorRef,
              public helperService: HelperServiceService,
              public configService:ConfigService,
              public  nzMessage:NzMessageService,
              public http: _HttpClient,) {
    this.config=configService.GetWebSiteConfig();
    this.userToken=this.configService.GetUserToken();
  }
  loginSecurityPolicyLevel?:string;
  fido2list:Map<string,string> =new Map<string, string>();
  OnBindUsbKey() {
    alert('已经绑定');
  }

  levelText?:string="加载中";
  levelDes?:string;

  async ngOnInit() {
    this.fido2list.set("key1", "key1 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key2", "key2 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key3", "key3 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key4", "key4 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key5", "key5 — 已于 2021 年 01 月 01 日注册");
    //获得安全策略
    let level = await this.authService.GetUserLoginSecurityPolicyLevel(this.userToken!.Email!);

    this.levelText=LoginSecurityPolicyLevel[level];
    this.levelDes=LoginSecurityPolicyLevelConvert.toString(level);
    this.cdr.detectChanges();
  }
  unBindFIDO2(keyid:string){
    if (this.fido2list.has(keyid)){
      this.fido2list.delete(keyid);
      alert("您已经成功解绑key："+keyid);
    }else {
      alert("您请求解绑的key不存在："+keyid);
    }
  }

  /**
   * 注册请求
   */
  async handleRegisterSubmit() {
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
      await this.registerNewCredential(newCredential);
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

  // This should be used to verify the auth data with the server
  // 发送到服务器，服务器验证通过后，注册成功
  async registerNewCredential(newCredential: any) {


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
    fromData.append('KeyName',this.value!);
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
  isVisible = false;
  isOkLoading = false;
  value?: string='key';
  placeholder?:string;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    if (this.value!=null || this.value!=''){
      this.handleRegisterSubmit().then(r => {
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * 绑定FIDO2令牌
   * @constructor
   */
  OnBindFIDO2() {
    this.isVisible=true;

  }

  OnChangeLoginSecurityPolicyLevel() {
      let optionList=["unlimited","loose","strict","compliant"];
      this.app_select_moal.showModal("设置登录安全策略",optionList,async (ok: boolean, value: string) => {
        if (ok && value!=null) {

          let level: LoginSecurityPolicyLevel;
          switch (value) {
            case LoginSecurityPolicyLevel[LoginSecurityPolicyLevel.unlimited]:
              level = LoginSecurityPolicyLevel.unlimited;
              break;
            case LoginSecurityPolicyLevel[LoginSecurityPolicyLevel.loose]:
              level = LoginSecurityPolicyLevel.loose;
              break;
            case LoginSecurityPolicyLevel[LoginSecurityPolicyLevel.strict]:
              level = LoginSecurityPolicyLevel.strict;
              break;
            case LoginSecurityPolicyLevel[LoginSecurityPolicyLevel.compliant]:
              level = LoginSecurityPolicyLevel.compliant;
              break;
            default:
              this.nzMessage.error("选择的安全策略无效");
              return;
          }
          let apiRe = await this.authService.SetUserLoginSecurityPolicyLevel(level!);
           if (apiRe.Ok){
             this.nzMessage.success("设置"+value+"登录安全策略成功")
             this.levelText=value;
             this.levelDes=LoginSecurityPolicyLevelConvert.toString(level);
             this.cdr.detectChanges();
           }else {
             this.nzMessage.error("设置"+value+"登录安全策略失败")
           }
        }else {
          this.nzMessage.success("未修改登录安全策略");
        }
      })
  }
  //修改用户密码
  OnChangeUserPassWord() {
    this.app_change_user_passwd.showModal("修改密码",async (ok: boolean,passOld:string, pass1: string,pass2:string)=>{
      if (ok){
        if (passOld==null||passOld==""||pass1==null || pass2==null || pass1=="" || pass2 == ""){
            this.nzMessage.error("无效的账户密码");
            return;
        }
        if (pass1!=pass2){
          this.nzMessage.error("用户输入的两个密码不相同");
            return;
        }
        //修改密码
        let apiRe=  await  this.userService.UpdatePwd(passOld,pass1);
        if (apiRe.Ok){
          this.nzMessage.success("修改密码成功");
        }else {
          this.nzMessage.error("修改密码失败："+apiRe.Msg);
        }
      }
    });

  }
}
