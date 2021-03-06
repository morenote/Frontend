import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {EPass2001Service} from "../../../../../services/Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {SignData} from "../../../../../models/DTO/USBKey/sign-data";
import {UserService} from "../../../../../services/User/user.service";
import {RealNameInformation} from "../../../../../models/entity/User/real-name-information";

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
  constructor(private http: _HttpClient,
              public nzMessage: NzMessageService,
              private cdr: ChangeDetectorRef,
              private  userService:UserService,
              private epass:EPass2001Service,
              private msg: NzMessageService) {}
  avatar = '';
  userLoading = true;
  user!: ProAccountSettingsUser;

  // #region geo

  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];

  async ngOnInit() {
    zip(this.http.get('/api/user/current'), this.http.get('/api/geo/province')).subscribe(
      ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
        this.userLoading = false;
        this.user = user;
        this.provinces = province;
        this.choProvince(user.geographic.province.key, false);
        this.cdr.detectChanges();
      }
    );
    let apiRe = await this.userService.GetRealNameInformation();
    if (apiRe!=null&& apiRe.Ok){
      let realName=apiRe.Data as RealNameInformation;
      if (realName==null){
        this.sfz="?????????";
        return;
      }
      this.sfz=realName.IdCardNo;
      this.cdr.detectChanges();
      if (!realName.Verify){
         setTimeout(()=>{
           this.nzMessage.error("???????????????????????????????????????????????????????????????",{nzDuration:5000});
         },1000)
      }else {

      }
    }
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
  sfz: any="?????????";//????????????

  async save() {
    //????????????

    let apiRe= await this.userService.SetRealNameInformation(this.sfz);
    if (apiRe!=null && apiRe.Ok){
      this.nzMessage.success("????????????????????????");
    }else {
      this.nzMessage.error("????????????????????????");
    }

    return apiRe!=null && apiRe.Ok;
  }
}
