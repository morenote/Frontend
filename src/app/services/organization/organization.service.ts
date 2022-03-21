import {Injectable} from '@angular/core';
import {Organization} from "../../models/entity/organization";
import {Observable} from "rxjs";
import {ApiRep} from "../../models/api/api-rep";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {OrganizationAuthorityEnum} from "../../models/enum/organization-authority-enum";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {

  }

  public GetOrganizationListByAuthorityEnum(authority: OrganizationAuthorityEnum): Observable<ApiRep> {
    let token = this.authService.GetToken();
    let queryParams = new HttpParams()
      .append('token', token)
      .append('AuthorityEnum', authority!);
    let config = this.configService.GetWebSiteConfig();
    let url = config.baseURL + '/api/Organization/GetOrganizationListByAuthorityEnum';
    let result = this.http.get<ApiRep>(url, {params: queryParams});
    return result;
  }

}
