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
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";

@Component({
  selector: 'app-account-settings-editor',
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    SelectMoalComponent
  ],
  standalone: true
})
export class ProAccountSettingsEditorComponent {

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


  mdOption?:string="vditor";//默认使用vditor
  rtOption?:string="textbus";//默认使用textbus

  async ngOnInit() {

    //获得安全策略
    let userInfo=await this.userService.GetUserInfo();
    this.mdOption=userInfo.MarkdownEditorOption;
    this.rtOption=userInfo.RichTextEditorOption;
    this.cdr.detectChanges();
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

  OnChangeLoginSecurityPolicyLevel() {

  }

  OnChangeMDOption() {
    let optionList=["vditor"];
    this.app_select_moal.showModal("设置markdown编辑器",optionList,async (ok: boolean, value: string) => {
      if (ok&&value!=null){
       this.nzMessage.success(value+"已设置");
      }
    });

  }

  OnChangeRTOption() {
    let optionList=["textbus"];
    this.app_select_moal.showModal("设置markdown编辑器",optionList,async (ok: boolean, value: string) => {
      if (ok&&value!=null){
        this.nzMessage.success(value+"已设置");
      }
    });
  }
}
