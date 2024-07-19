import { Injectable } from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {AuthService} from "../auth/auth.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";

@Injectable({
  providedIn: 'root'
})
export class LoginAuditService {
  userId: string | null;
  token: string | null;
  config: WebsiteConfig;

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {
    let userToken=this.configService.GetUserToken();
    this.userId =userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }
  public GetUserLoginLogging(){
    let url = this.config.baseURL + '/api/Auth/GetUserLoginLogging';
    let httpParams = new HttpParams()
      .append('token', this.token!);
    let result = this.http.get<ApiRep>(url, {params: httpParams});
    return result;
  }



}
