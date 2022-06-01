import {Injectable} from '@angular/core';
import {WebsiteConfig} from "../../../../models/config/website-config";
import {AuthService} from "../../../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../../../config/config.service";
import {Observable} from "rxjs";
import {ApiRep} from "../../../../models/api/api-rep";
import {ServerChallenge} from "../../../../models/DTO/USBKey/server-challenge";
import {ClientMessage} from "../../../../models/DTO/USBKey/client-message";
import {ClientMessageType} from "../../../../models/DTO/USBKey/message-type";
import {ClientResponse} from "../../../../models/DTO/USBKey/client-response";

@Injectable({
  providedIn: 'root'
})
export class EPass2001Service {
  userId: string | null;
  token: string | null;
  config: WebsiteConfig;
  localhostUrl: string = "/localhost";

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {


    let userToken = this.authService.GetUserToken();
    this.userId = userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }

  public SendChallengeToePass2001(serverChallenge: ServerChallenge): Promise<ApiRep> {
    return  new Promise<ApiRep>(resolve => {
      let message = new ClientMessage();
      message.MessageType = ClientMessageType.Challenge;
      message.Data = serverChallenge;
      let json = JSON.stringify(message)

      let url = this.localhostUrl;
      let postCfg = {
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      };
      let result = this.http.post<ApiRep>(url, json, postCfg).subscribe(apiRe=>{
        resolve(apiRe);
      });
    })
  }
  public LoginByResponse(clinetResponse:ClientResponse):Promise<ApiRep>{
    return  new Promise<ApiRep>(resolve => {
      let data=JSON.stringify(clinetResponse);
      let url = this.config.baseURL + '/api/USBKey/LoginResponse';
      let formData = new FormData();
      formData.set('data', data);
      let result = this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
        resolve(apiRe);
      });
    })
  }

  public GetLoginChallenge(email: string): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/USBKey/GetLoginChallenge';
      let httpParams = new HttpParams()
        .append('email', email);
      let result = this.http.get<ApiRep>(url, {params: httpParams});
      result.subscribe(apiRe => {
        resolve(apiRe);
      });
    })
  }


}
