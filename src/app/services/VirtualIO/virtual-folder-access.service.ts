import {Injectable} from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {ConfigService} from "../config/config.service";
import {VirtualFolderInfo} from "../../models/entity/File/VirtualFolderInfo";
import {ApiRep} from "../../models/api/api-rep";

@Injectable({
  providedIn: 'root'
})
export class VirtualFolderAccessService {

  userId: string;
  token: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;

  constructor(public authService: AuthService,
              public http: HttpClient,
              public epass: EPass2001Service,
              public configService: ConfigService) {
    let userToken = this.configService.GetUserToken();
    this.userId = userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
    this.sc = configService.GetSecurityConfigDTOFromDB();
  }

  public GetRootVirtualFolderInfos(repositoryHexId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let url = this.config.baseURL + '/api/VirtualFolderAccess/GetRootVirtualFolderInfos';
      let httpParams = new HttpParams()
        .append('token', this.token!)
        .append('repositoryHexId', repositoryHexId);
      let result = this.http.get<ApiRep>(url, {params: httpParams}).subscribe(apiRe=>{
       resolve(apiRe);
      });

    })
  }
}
