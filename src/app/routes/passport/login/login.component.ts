import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, Optional} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StartupService} from '@core';
import {ReuseTabService} from '@delon/abc/reuse-tab';
import {DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService} from '@delon/auth';
import {_HttpClient, SettingsService} from '@delon/theme';
import {environment} from '@env/environment';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTabChangeEvent} from 'ng-zorro-antd/tabs';
import {Subscription} from 'rxjs';

import {ApiRep} from '../../../models/api/api-rep';
import {UserLoginSecurityStrategy} from '../../../models/auth/user-login-security-strategy';
import {WebsiteConfig} from '../../../models/config/website-config';
import {AuthService} from '../../../services/auth/auth.service';
import {ConfigService} from '../../../services/config/config.service';
import {UserToken} from "../../../models/DTO/user-token";
import {EPass2001Service} from "../../../services/Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {ServerChallenge} from "../../../models/DTO/USBKey/server-challenge";
import {NzMessageService} from "ng-zorro-antd/message";
import {ClientResponse} from "../../../models/DTO/USBKey/client-response";
import {LoginSecurityPolicyLevel} from "../../../models/enum/LoginSecurityPolicyLevel/login-security-policy-level";

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: UntypedFormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    public authService: AuthService,
    private settingService: SettingsService,
    public epass: EPass2001Service,
    public nzMessage: NzMessageService,
    configService: ConfigService
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });
    this.configService = configService;
    this.webSiteConfig = configService.GetWebSiteConfig();
  }

  // #region fields
  isShowPassWord: boolean = false;

  get userName(): AbstractControl {
    return this.form.get('userName')!;
  }

  get password(): AbstractControl {
    return this.form.get('password')!;
  }

  get mobile(): AbstractControl {
    return this.form.get('mobile')!;
  }

  get captcha(): AbstractControl {
    return this.form.get('captcha')!;
  }

  form: UntypedFormGroup;
  error = '';
  type = 0;
  loading = false;

  // #region get captcha

  count = 0;
  interval$: any;
  //配置服务
  configService: ConfigService;
  //获取网站配置信息
  webSiteConfig: WebsiteConfig;

  // #endregion

  switch({index}: NzTabChangeEvent): void {
    this.type = index!;
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({onlySelf: true});
      this.mobile.updateValueAndValidity({onlySelf: true});
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  userNameIsOk: boolean = false; //用户名是否是ok的
  showPwdBox = false;
  userNameLoginButtonValue: string = '登录';
  userLoginSecurityStrategy: UserLoginSecurityStrategy | undefined;
  securityStrategy: UserLoginSecurityStrategy | undefined;

  getUserLoginSecurityStrategy(): Subscription {
    let url = `${this.webSiteConfig.baseURL}/api/User/GetUserLoginSecurityStrategy?_allow_anonymous=true&userName=${this.userName.value}`;
    let obs: Subscription = this.http.get<ApiRep>(url).subscribe((apiRe: ApiRep) => {
      let securityStrategy: UserLoginSecurityStrategy = apiRe.Data as UserLoginSecurityStrategy;
      // alert(securityStrategy.UserName);
      this.securityStrategy = securityStrategy;
      if (securityStrategy.AllowPassWordLogin) {
        this.showPwdBox = true;
        console.log('已经允许密码登录方式');
        return;
      }
    });

    return obs;
  }

  /**
   * 通过提交密码登录
   */
  async submit() {
    this.error = '';

    if (this.password == null) {
      alert('缺少登录密码');
      return;
    }
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        alert('缺少登录条件1');
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        alert('缺少登录条件2');
        return;
      }
    }

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000)
    this.cdr.detectChanges();
    try {
      let requestNumber=await  this.authService.TakeSessionCode();
      //登录
      let  apiRe = await this.authService.PasswordChallenge(String(this.type), this.userName.value, this.password.value,requestNumber);
      if (this.error) {
        this.loading = false;
        alert("无法正常登录");
        return;
      }
      if (apiRe.Ok != true) {
        this.loading = false;
        this.error = apiRe.Msg!;
        this.cdr.detectChanges();
        console.log('进入111');
        return;
      }
      //获得登录方式
      let level=await  this.authService.GetUserLoginSettings(this.userName.value);
      if (level==LoginSecurityPolicyLevel.compliant){
         let apoRe=  await  this.epass.login(this.userName.value,requestNumber);
         if (apoRe==null || !apoRe.Ok){
           this.nzMessage.error("USBKey身份鉴别失败")
           return;
         }
      }
      let userToken=await  this.authService.SubmitLogin(this.userName.value,requestNumber);
      // 清空路由复用信息
      this.reuseTabService.clear();
      // 设置用户Token信息
      this.tokenService.set({
        token: userToken.Token
      });

      this.settingService.setUser({
        name:userToken.Username,
        avatar:"https://gw.alipayobjects.com/zos/rmsportal/lctvVCLfRpYCkYxAsiVQ.png",
        email:userToken.Email
      });

      this.configService.SetUserToken(userToken);
      this.nzMessage.success("业务系统身份鉴别成功")

      // 跳转到工作台
      await this.router.navigate(['/']);
    }catch (error:any) {
      this.nzMessage.error(error.message);
    }
  }

  // #region social

  async open(type: string, openType: SocialOpenType = 'href') {
    if (type == 'fido2') {
      this.handleSignInSubmit().then(r => {
        console.log('fido2 function');
      });
      return;
    }
    let url = ``;
    let callback = ``;
    if (environment.production) {
      callback = `https://ng-alain.github.io/ng-alain/#/passport/callback/${type}`;
    } else {
      callback = `http://localhost:4200/#/passport/callback/${type}`;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case  'usbkey':


        if (this.userName.value == null || this.userName.value == "") {
          this.nzMessage.error("请先填写登录邮箱");
          return;
        }
        let  level=await this.authService.GetUserLoginSettings(this.userName.value);
        this.nzMessage.info("已经获得用户安全策略："+LoginSecurityPolicyLevel[level])
        await this.sleep(2000);
        if (level > 1 && this.password.value==null){
          this.nzMessage.error("已启用双因素认证，必须填写口令");
          return;
        }else {
          this.nzMessage.info("安全策略检查成功："+level)
          await this.sleep(2000);
        }

        let apiRep=await  this.epass.login(this.userName.value,"");
        if (!apiRep.Ok){
          this.nzMessage.error("应用系统身份鉴别失败："+apiRep.Msg);
        }else {
          this.nzMessage.success("应用系统身份鉴别成功")
          await this.sleep(2000);
          this.nzMessage.success("正在登录到系统，请稍候....")
          await this.sleep(2000);
          //登录步骤
          let userToken: UserToken = apiRep.Data;
          // 清空路由复用信息
          this.reuseTabService.clear();
          // 设置用户Token信息
          this.tokenService.set({
            token: userToken.Token
          });
          this.configService.SetUserToken(userToken);
          // 直接跳转
          await this.router.navigate(['/']);
        }
        return;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window'
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href'
      });
    }
  }
   sleep(millisecond:any):Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, millisecond)
    })
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  okUserNameChage() {
    if (this.userName != null) {
      this.userNameIsOk = true;
    } else {
      this.userNameIsOk = false;
    }
  }

  //==============================FIDO2登录验证===========================================
  async handleSignInSubmit() {
    let username = this.userName.value;

    // prepare form post data
    let formData = new FormData();
    formData.append('username', username);

    // send to server for registering
    let makeAssertionOptions;
    try {
      let res = await fetch('/assertionOptions', {
        method: 'POST', // or 'PUT'
        body: formData, // data can be `string` or {object}!
        headers: {
          Accept: 'application/json'
        }
      });

      makeAssertionOptions = await res.json();
    } catch (e) {
      this.ShowErrorMessage('Request to server failed');
    }

    console.log('Assertion Options Object', makeAssertionOptions);

    // show options error to user
    if (makeAssertionOptions.status !== 'ok') {
      console.log('Error creating assertion options');
      console.log(makeAssertionOptions.errorMessage);
      this.ShowErrorMessage(makeAssertionOptions.errorMessage);
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

    this.ShowInfoMessage('Tap your security key to login');

    // ask browser for credentials (browser will ask connected authenticators)
    let credential;
    try {
      credential = await navigator.credentials.get({publicKey: makeAssertionOptions});
    } catch (err) {
      this.ShowErrorMessage('error');
    }

    try {
      await this.verifyAssertionWithServer(credential);
    } catch (e) {
      this.ShowErrorMessage('Could not verify assertion');
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
      this.ShowErrorMessage('Request to server failed');
      throw e;
    }

    console.log('Assertion Object', response);

    // show error
    if (response.status !== 'ok') {
      console.log('Error doing assertion');
      console.log(response.errorMessage);
      this.ShowErrorMessage(response.errorMessage);
      return;
    }

    // show success message

    this.ShowInfoMessage("You're logged in successfully.");
  }

  //============================界面提示===================================
  ShowInfoMessage(message: string): void {
    this.modal.info({
      nzTitle: 'This is a notification message',
      nzContent: message,
      nzOnOk: () => console.log('Info OK')
    });
  }

  ShowSuccess(message: string): void {
    this.modal.success({
      nzTitle: 'This is a success message',
      nzContent: message
    });
  }

  ShowErrorMessage(message: string): void {
    this.modal.error({
      nzTitle: 'This is an error message',
      nzContent: message
    });
  }

  SHowWarningMessage(message: string): void {
    this.modal.warning({
      nzTitle: 'This is an warning message',
      nzContent: message
    });
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
