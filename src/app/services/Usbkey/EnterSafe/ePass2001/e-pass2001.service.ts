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
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class EPass2001Service {
  userId: string | null;
  token: string | null;
  config: WebsiteConfig;
  localhostUrl: string = "/localhost";

  constructor(public authService: AuthService,
              public http: HttpClient,
              public nzMessage: NzMessageService,
              public configService: ConfigService) {


    let userToken = this.configService.GetUserToken();
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

  public GetLoginChallenge(email: string,requestNumber:string): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/USBKey/GetLoginChallenge';
      let httpParams = new HttpParams()
        .append('email', email)
        .append('requestNumber', requestNumber);
      let result = this.http.get<ApiRep>(url, {params: httpParams});
      result.subscribe(apiRe => {
        resolve(apiRe);
      });
    })
  }

  sleep(millisecond:any):Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, millisecond)
    })
  }

  public async login(email:string,requestNumber: string):Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      //获得服务器挑战随机数
      let challenge!: ServerChallenge;
      this.nzMessage.info("正在请求服务器挑战");
      await this.sleep(2000);
      let apiRep = await this.GetLoginChallenge(email, requestNumber);
      if (apiRep.Ok) {
        challenge = apiRep.Data;
        this.nzMessage.info("获得服务器挑战" + challenge.Id);
      } else {
        this.nzMessage.error("获得服务器挑战失败");
        return;
      }
      //发送到智能密码钥匙
      await this.sleep(2000);
      this.nzMessage.info("正在检测智能密码钥匙，请勿操作");
      await this.sleep(2000);
      if (challenge != null) {
        this.nzMessage.info("正在挑战智能密码钥匙" + challenge.Id);
      }
      await this.sleep(2000);
      apiRep = await this.SendChallengeToePass2001(challenge!);
      let res: ClientResponse;
      if (apiRep.Ok) {
        this.nzMessage.success("智能密码钥匙签名成功");
        res = apiRep.Data as ClientResponse;
      } else {
        this.nzMessage.error("智能密钥钥匙签名失败");
        return;
      }
      //发送到服务器验签
      await this.sleep(2000);
      this.nzMessage.info("将签名结果发送到服务器");
      await this.sleep(2000);
      apiRep = await this.LoginByResponse(res);
      if (apiRep!=null){
        resolve(apiRep)
      }
      throw  new Error("epass2001 login is error")
    });
  }


}
