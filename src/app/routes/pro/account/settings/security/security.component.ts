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
import {EPass2001Service} from "../../../../../services/Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {USBKeyBinding} from "../../../../../models/entity/usbkey-binding";
import {Router} from "@angular/router";
import {Fido2Service} from "../../../../../services/auth/fido2.service";

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
              public  epass2001:EPass2001Service,
              public router: Router,
              public fido2:Fido2Service,
              public http: _HttpClient,) {
    this.config=configService.GetWebSiteConfig();
    this.userToken=this.configService.GetUserToken();
  }
  loginSecurityPolicyLevel?:string;
  fido2list:Map<string,string> =new Map<string, string>();
  usbKeylist:Map<string,string> =new Map<string, string>();
  async OnBindUsbKey() {
    let apiRe = await this.epass2001.Register(this.configService.GetUserToken().Email, "1111");
    if (apiRe.Ok) {
      let key= apiRe.Data as USBKeyBinding;
      alert("您已经成功注册key："+key.Id);
      this.usbKeylist.set(key.Id!, key.Modulus!);
      this.cdr.detectChanges();
    } else {
      alert("注册key失败："+apiRe.Msg);
    }
  }
  async unBindUsbKey(keyid: string) {
    if (this.usbKeylist.has(keyid)) {
      let apiRe = await this.epass2001.Delete(keyid);
      if (apiRe.Ok){
        this.usbKeylist.delete(keyid);
        alert("您已经成功解绑key：" + keyid);
        this.cdr.detectChanges();
      }else {
        alert("解绑key失败：" + keyid);
      }
    } else {
      alert("您请求解绑的key不存在：" + keyid);
    }
  }
  levelText?:string="加载中";
  levelDes?:string;

  async ngOnInit() {
    this.fido2list.set("key1", "key1 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key2", "key2 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key3", "key3 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key4", "key4 — 已于 2021 年 01 月 01 日注册");
    this.fido2list.set("key5", "key5 — 已于 2021 年 01 月 01 日注册");
    //更新列表
    let list=await this.epass2001.List(this.configService.GetUserToken().UserId);
    for (const item of list) {
      this.usbKeylist.set(item.Id!, item.Modulus!);
    }
    //获得安全策略
    let level = await this.authService.GetUserLoginSettings(this.userToken!.Email!);

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


  isVisible = false;
  isOkLoading = false;
  value?: string='key';
  placeholder?:string;

  showModal(): void {
    this.isVisible = true;
  }

  async handleOk() {
    this.isVisible = false;
    this.isOkLoading = false;
    if (this.value != null || this.value != '') {
      await this.fido2.handleRegisterSubmit(this.value as string);
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
          let apiRe = await this.authService.SetUserLoginSettings(level!);
           if (apiRe.Ok){
             this.nzMessage.success("设置"+value+"登录安全策略成功")
             this.levelText=value;
             this.levelDes=LoginSecurityPolicyLevelConvert.toString(level);
             this.cdr.detectChanges();
           }else {

             this.nzMessage.error("设置"+value+"登录安全策略失败:"+apiRe.Msg);
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
