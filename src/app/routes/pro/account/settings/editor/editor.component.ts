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
  selector: 'app-account-settings-editor',
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.Default
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


  mdOption?:string="vditor";//????????????vditor
  rtOption?:string="textbus";//????????????textbus

  async ngOnInit() {

    //??????????????????
    let userInfo=await this.userService.GetUserInfo();
    this.mdOption=userInfo.MarkdownEditorOption;
    this.rtOption=userInfo.RichTextEditorOption;
    this.cdr.detectChanges();
  }

  //??????????????????
  OnChangeUserPassWord() {
    this.app_change_user_passwd.showModal("????????????",async (ok: boolean,passOld:string, pass1: string,pass2:string)=>{
      if (ok){
        if (passOld==null||passOld==""||pass1==null || pass2==null || pass1=="" || pass2 == ""){
          this.nzMessage.error("?????????????????????");
          return;
        }
        if (pass1!=pass2){
          this.nzMessage.error("????????????????????????????????????");
          return;
        }
        //????????????
        let apiRe=  await  this.userService.UpdatePwd(passOld,pass1);
        if (apiRe.Ok){
          this.nzMessage.success("??????????????????");
        }else {
          this.nzMessage.error("?????????????????????"+apiRe.Msg);
        }
      }
    });

  }

  OnChangeLoginSecurityPolicyLevel() {

  }

  OnChangeMDOption() {
    let optionList=["vditor"];
    this.app_select_moal.showModal("??????markdown?????????",optionList,async (ok: boolean, value: string) => {
      if (ok&&value!=null){
       this.nzMessage.success(value+"?????????");
      }
    });

  }

  OnChangeRTOption() {
    let optionList=["textbus"];
    this.app_select_moal.showModal("??????markdown?????????",optionList,async (ok: boolean, value: string) => {
      if (ok&&value!=null){
        this.nzMessage.success(value+"?????????");
      }
    });
  }
}
