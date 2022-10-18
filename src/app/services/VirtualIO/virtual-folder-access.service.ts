import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SecurityConfigDTO } from '../../models/DTO/Config/SecurityConfig/security-config-dto';
import { ApiRep } from '../../models/api/api-rep';
import { WebsiteConfig } from '../../models/config/website-config';
import { VirtualFolderInfo } from '../../models/entity/File/VirtualFolderInfo';
import { EPass2001Service } from '../Usbkey/EnterSafe/ePass2001/e-pass2001.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class VirtualFolderAccessService {
  userId: string;
  token: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;

  constructor(
    public authService: AuthService,
    public http: HttpClient,
    public epass: EPass2001Service,
    public configService: ConfigService
  ) {
    let userToken = this.configService.GetUserToken();
    this.userId = userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
    this.sc = configService.GetSecurityConfigDTOFromDB();
  }

  public GetRootVirtualFolderInfos(repositoryHexId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let url = `${this.config.baseURL}/api/VirtualFolderAccess/GetRootVirtualFolderInfos`;
      let httpParams = new HttpParams().append('token', this.token!).append('repositoryHexId', repositoryHexId);
      let result = this.http.get<ApiRep>(url, { params: httpParams }).subscribe(apiRe => {
        resolve(apiRe);
      });
    });
  }
  public GetFiles(repositoryHexId: string, folderId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let url = `${this.config.baseURL}/api/VirtualFolderAccess/GetFiles`;
      let httpParams = new HttpParams()
        .append('token', this.token!)
        .append('repositoryHexId', repositoryHexId)
        .append('folderId', folderId);
      let result = this.http.get<ApiRep>(url, { params: httpParams }).subscribe(apiRe => {
        resolve(apiRe);
      });
    });
  }

  public GetFolders(repositoryHexId: string, folderId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let url = `${this.config.baseURL}/api/VirtualFolderAccess/GetFolders`;
      let httpParams = new HttpParams()
        .append('token', this.token!)
        .append('repositoryHexId', repositoryHexId)
        .append('folderId', folderId);
      let result = this.http.get<ApiRep>(url, { params: httpParams }).subscribe(apiRe => {
        resolve(apiRe);
      });
    });
  }
}
