import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProRealPersonAuthenticationComponent implements OnInit {
  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef, private msg: NzMessageService) {}
  avatar = '';
  userLoading = true;
  user!: ProAccountSettingsUser;

  // #region geo

  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];

  ngOnInit(): void {
    zip(this.http.get('/user/current'), this.http.get('/geo/province')).subscribe(
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
    this.http.get(`/geo/${pid}`).subscribe(res => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion
  sfz: any="XXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

  save(): boolean {
    this.msg.success("更新成功");
    return false;
  }
}
