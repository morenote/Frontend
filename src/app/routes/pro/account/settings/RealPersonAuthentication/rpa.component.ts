import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {EPass2001Service} from "../../../../../services/Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {SignData} from "../../../../../models/DTO/USBKey/sign-data";
import {UserService} from "../../../../../services/User/user.service";
import {RealNameInformation} from "../../../../../models/entity/User/real-name-information";
import {WebsiteConfig} from "../../../../../models/config/website-config";
import {ConfigService} from "../../../../../services/config/config.service";
import {SHARED_IMPORTS} from "@shared";

interface ProAccountSettingsUser {
  email: string;
  name: string;
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
  selector: 'app-account-settings-rpa',
  templateUrl: './rpa.component.html',
  styleUrls: ['./rpa.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[...SHARED_IMPORTS,]
})
export class ProRealPersonAuthenticationComponent implements OnInit {
  config?: WebsiteConfig;

  constructor(private http: _HttpClient,
              private configService: ConfigService,
              public nzMessage: NzMessageService,
              private cdr: ChangeDetectorRef,
              private  userService:UserService,
              private epass:EPass2001Service,
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
    zip(this.http.get(this.config?.baseURL +'/api/user/current'), this.http.get(this.config?.baseURL +'/api/geo/province')).subscribe(
      ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
        this.userLoading = false;
        this.user = user;
        this.provinces = province;
        this.choProvince(user.geographic.province.key, false);
        this.cdr.detectChanges();
      }
    );


  }

  choProvince(pid: string, cleanCity: boolean = true): void {
    this.http.get(this.config?.baseURL +`/api/geo/${pid}`).subscribe(res => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion
  sfz: any="加载中";//身份证号

  async save() {
    //数据签名


  }
}
