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
import {SignData} from "../../../../models/DTO/USBKey/sign-data";
import {DataSign} from "../../../../models/DTO/USBKey/data-sign";
import {LogUtil} from "../../../../shared/utils/log-util";

@Injectable({
  providedIn: 'root'
})
export class EPass2001Service {
  userId?: string | null;
  token?: string | null;
  config: WebsiteConfig;
  localhostUrl: string = "http://localhost:8070";

  constructor(
              public http: HttpClient,
              public nzMessage: NzMessageService,
              public configService: ConfigService) {


    let userToken = this.configService.GetUserToken();
    if (userToken!=null){
      this.userId = userToken.UserId;
      this.token = userToken.Token;
    }
    this.config = this.configService.GetWebSiteConfig();
    if (localStorage.getItem("localhostUrl")!=null){
      this.localhostUrl=localStorage.getItem("localhostUrl")!;
    }
  }

  public async SendChallengeToePass2001(serverChallenge: ServerChallenge): Promise<ApiRep> {
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
  public async SendSignToePass2001(signData: SignData): Promise<DataSign> {
    return  new Promise<DataSign>(resolve => {
      let message = new ClientMessage();
      message.MessageType = ClientMessageType.Sign;
      message.Data = signData;
      let json = JSON.stringify(message)

      let url = this.localhostUrl;
      let postCfg = {
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      };
      let result = this.http.post<ApiRep>(url, json, postCfg).subscribe(apiRe=>{
        if (apiRe!=null && apiRe.Ok){
          resolve(apiRe.Data);
        }else {
          throw new Error("SendSignToePass2001 is Error");
        }
      });
    })
  }





  public async LoginByResponse(clinetResponse:ClientResponse):Promise<ApiRep>{
    return  new Promise<ApiRep>(resolve => {
      let data=JSON.stringify(clinetResponse);
      let url = this.config.baseURL + '/api/USBKey/LoginResponse';
      let formData = new FormData();
      formData.set('data', data);
      this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
        resolve(apiRe);
      });
    })
  }

  public GetLoginChallenge(email: string,requestNumber:string): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/USBKey/GetLoginChallenge';
      let httpParams = new HttpParams()
        .append('email', email)
        .append('sessionCode', requestNumber);
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
      LogUtil.debug("正在请求服务器挑战");

      let apiRep = await this.GetLoginChallenge(email, requestNumber);
      if (apiRep.Ok) {
        challenge = apiRep.Data;
        LogUtil.debug("获得服务器挑战" + challenge.Id);
      } else {
        this.nzMessage.error("获得服务器挑战失败");
        return;
      }
      //发送到智能密码钥匙

      this.nzMessage.info("正在检测智能密码钥匙，请勿操作", {nzDuration:1000});

      if (challenge != null) {
        LogUtil.debug("正在挑战智能密码钥匙" + challenge.Id);
      }

      apiRep = await this.SendChallengeToePass2001(challenge!);
      let res: ClientResponse;
      if (apiRep.Ok) {
        LogUtil.debug("智能密码钥匙签名成功");
        res = apiRep.Data as ClientResponse;
      } else {
        this.nzMessage.error("智能密钥钥匙签名失败");
        return;
      }
      //发送到服务器验签

      LogUtil.debug("将签名结果发送到服务器");

      apiRep = await this.LoginByResponse(res);
      if (apiRep!=null){
        resolve(apiRep)
      }else {
        throw  new Error("epass2001 login is error")
      }

    });
  }


}
