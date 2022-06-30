import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
import {ConfigService} from "../../../../../services/config/config.service";
import {WebsiteConfig} from "../../../../../models/config/website-config";

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
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountSettingsBaseComponent implements OnInit {
  config?:WebsiteConfig;
  constructor(private http: _HttpClient,
              private cdr: ChangeDetectorRef,

              private  configService:ConfigService,
              private msg: NzMessageService) {
    this.config=configService.GetWebSiteConfig();
  }
  avatar = '';
  userLoading = true;
  user!: ProAccountSettingsUser;

  // #region geo

  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];

  ngOnInit(): void {
    zip(this.http.get(this.config?.baseURL+'/api/user/current'),
      this.http.get(this.config?.baseURL+'/api/geo/province')).subscribe(
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
    this.http.get(`/api/geo/${pid}`).subscribe(res => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save(): boolean {
    this.msg.success(JSON.stringify(this.user));
    return false;
  }
}
