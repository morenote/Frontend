import {Injectable} from '@angular/core';
import {WebsiteConfig} from "../../../../models/config/website-config";
import {AuthService} from "../../../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../../config/config.service";
import {Observable} from "rxjs";
import {ApiRep} from "../../../../models/api/api-rep";
import {ServerChallenge} from "../../../../models/DTO/USBKey/server-challenge";

@Injectable({
  providedIn: 'root'
})
export class EPass2001Service {
  userId: string | null;
  token: string | null;
  config: WebsiteConfig;
  localhostUrl: string = "http://localhost:3100";

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {


    let userToken = this.authService.GetUserToken();
    this.userId = userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }

  public LoginByUsbKey(serverChallenge: ServerChallenge, notebookTitle: string): Observable<ApiRep> {
    let url = this.localhostUrl;
    let postCfg = {
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    };
    let result = this.http.post<ApiRep>(url, JSON.stringify(serverChallenge), postCfg);
    return result;
  }


}
