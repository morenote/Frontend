import {Injectable} from '@angular/core';
import {Organization} from "../../models/entity/organization";
import {Observable} from "rxjs";
import {ApiRep} from "../../models/api/api-rep";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {OrganizationAuthorityEnum} from "../../models/enum/organization-authority-enum";
import {WebsiteConfig} from "../../models/config/website-config";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  userId!: string ;
  token!: string ;
  config: WebsiteConfig;
  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {
    let userToken=this.configService.GetUserToken();
    this.userId =userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }

  public GetOrganizationListByAuthorityEnum(authority: OrganizationAuthorityEnum): Observable<ApiRep> {

    let queryParams = new HttpParams()
      .append('token', this.token!)
      .append('AuthorityEnum', authority!);
    let config = this.configService.GetWebSiteConfig();
    let url = config.baseURL + '/api/Organization/GetOrganizationListByAuthorityEnum';
    let result = this.http.get<ApiRep>(url, {params: queryParams});
    return result;
  }

}
