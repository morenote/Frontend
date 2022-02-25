import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import {concatWith, Observable, Subscription} from 'rxjs';

import { ApiRe } from '../../../models/api/api-re';
import { UserLoginSecurityStrategy } from '../../../models/auth/user-login-security-strategy';
import { WebsiteConfig } from '../../../models/config/website-config';
import { ConfigService } from '../../../services/config/config.service';

import * as http from 'http';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
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
    this.webSiteConfig = configService.getWebSiteConfig();
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
  form: FormGroup;
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

  switch({ index }: NzTabChangeEvent): void {
    this.type = index!;
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
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
    let obs: Subscription = this.http.get<ApiRe>(url).subscribe((apiRe: ApiRe) => {
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

  submit(): void {
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
    this.cdr.detectChanges();
    const formData = new FormData();
    formData.set('type', String(this.type));
    formData.set('email', this.userName.value);
    formData.set('pwd', this.password.value);

    this.http.post(`${this.webSiteConfig.baseURL}/api/Auth/login?_allow_anonymous=true`, formData).subscribe(res => {
      console.log(res);
      if (res.Ok != true) {
        this.loading = false;
        this.error = res.Msg;
        this.cdr.detectChanges();
        console.log('进入111');
        return;
      }

      // 清空路由复用信息
      this.reuseTabService.clear();
      // 设置用户Token信息
      this.tokenService.set({
        token: res.Token
      });
      // 直接跳转
      this.router.navigate(['/']);
    });
  }

  // #region social

  open(type: string, openType: SocialOpenType = 'href'): void {
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
}
