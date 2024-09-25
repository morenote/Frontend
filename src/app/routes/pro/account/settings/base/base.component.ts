import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {_HttpClient, SettingsService} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {zip} from 'rxjs';
import {ConfigService} from "../../../../../services/config/config.service";
import {WebsiteConfig} from "../../../../../models/config/website-config";
import {UserService} from "../../../../../services/User/user.service";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {SEComponent} from "@delon/abc/se";
import {SharedModule} from "@shared";
import {NzUploadComponent} from "ng-zorro-antd/upload";

interface ProAccountSettingsUser {
  email?: string;
  name?: string;
  profile: string;
  country: string;
  address: string;
  phone: string;
  avatar: string;
  geographic: {
    province: {
      key: string;
    };
    city: {
      key: string;
    };
  };
}

interface ProAccountSettingsCity {
  name: string;
  id: string;
}

@Component({
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  standalone: true,
  imports: [
    NzSelectComponent,
    NzOptionComponent,
    SEComponent,
    SharedModule,
    NzUploadComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountSettingsBaseComponent implements OnInit {
  config?: WebsiteConfig;

  constructor(private http: _HttpClient,
              private cdr: ChangeDetectorRef,
              private settingsService:SettingsService,
              private userService: UserService,
              private configService: ConfigService,
              private msg: NzMessageService) {
    this.config = configService.GetWebSiteConfig();
  }

  avatar = '';
  userLoading = true;
  user!: ProAccountSettingsUser;

  // #region geo

  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];

  async ngOnInit() {
    this.userLoading = false;
    let userInfo = await this.userService.GetUserInfo();
    this.userLoading = false;
    this.user = {
      address: "",
      avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
      country: "",
      geographic: {city: {key: "330000"}, province: {key: "330100"}},
      phone: "这里显示你的手机号",
      profile: "这里显示你的简介",
      email: userInfo.Email,
      name: userInfo.Username
    };
    //this.choProvince(this.user.geographic.province.key, false);
    this.cdr.detectChanges();
    // zip(this.http.get(this.config?.baseURL+'/api/user/current'),
    //   this.http.get(this.config?.baseURL+'/api/geo/province')).subscribe(
    //   ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
    //     this.userLoading = false;
    //
    //     this.provinces = province;
    //     this.choProvince(user.geographic.province.key, false);
    //     this.cdr.detectChanges();
    //   }
    // );
  }

  choProvince(pid: string, cleanCity: boolean = true): void {
    this.http.get(`/api/geo/${pid}`).subscribe(res => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  async save() {
    if (this.user.name==null || this.user.name ==""){
      this.msg.error("昵称不能为空");
      return ;
    }
    let apiRe = await this.userService.UpdateUsername(this.user.name!);
    if (apiRe==null || apiRe.Ok==false){
      this.msg.error(apiRe.Msg!);
      return ;
    }else {
      this.msg.success("昵称更新成功");
      this.settingsService.setUser({
        name:this.user.name,
        avatar:"https://gw.alipayobjects.com/zos/rmsportal/lctvVCLfRpYCkYxAsiVQ.png",
        email:this.user.email
      });
      return ;
    }
  }
}
