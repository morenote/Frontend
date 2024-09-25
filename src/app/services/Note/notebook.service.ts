import { inject, Injectable } from "@angular/core";
import { Notebook } from "../../models/entity/notebook";
import { AuthService } from "../auth/auth.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigService } from "../config/config.service";
import { ApiRep } from "../../models/api/api-rep";
import { Observable } from "rxjs";
import { WebsiteConfig } from "../../models/config/website-config";
import { SignData } from "../../models/DTO/USBKey/sign-data";
import { EPass2001Service } from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import { SecurityConfigDTO } from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import { DataSign } from "../../models/DTO/USBKey/data-sign";
import { NotebookType } from "../../models/enum/notebook-type";
import { TelegramFacService } from "../Communication/telegram-fac.service";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  userId: string;
  token: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;
  telegramFacService:TelegramFacService=inject(TelegramFacService);

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


  /**
   *  获得我的笔记仓库列表
   * @constructor
   */
  public GetMyNotebook(repositoryType:NotebookType): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Notebook/GetMyNotebook';
    let queryParams = new HttpParams()
      .append('userId', (this.userId)!)
      .append('userId', (this.userId)!)
      .append('repositoryType', repositoryType)
      .append('token', this.token);
    let result = this.http.get<ApiRep>(url, {params: queryParams});
    return result;
  }

  public CreateNotebook(notebook: Notebook): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let signData = new SignData();
      let dataSign=new DataSign();
      if (this.sc.ForceDigitalSignature){
        signData.Id = "";
        signData.Data = JSON.stringify(notebook);
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/Notebook/CreateNotebook";
        dataSign = await this.epass.SendSignToePass2001(signData);
      }

      let url = this.config.baseURL + '/api/Notebook/CreateNotebook';
      let fromData = new FormData()
      fromData.set('token', this.token!)
      fromData.set('data', JSON.stringify(notebook));
      fromData.set('dataSignJson', JSON.stringify(dataSign));
      let tel=this.telegramFacService.Instace();
      let map=new Map<string,string>();
      map.set('token', this.token!)
      map.set('data', JSON.stringify(notebook));

       tel= tel.setURL("/api/Notebook/CreateNotebook")
        .addData(map)
         .addDigitalEnvelope("data")

      return await tel.post();

      // let result = this.http.post<ApiRep>(url, fromData).subscribe(apiRe => {
      //   resolve(apiRe);
      // })
    });

  }

  public DeleteNotebook(id: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let signData = new SignData();
      let dataSign = new DataSign();

      if (this.sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = id;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/Notebook/DeleteNotebook";

        dataSign = await this.epass.SendSignToePass2001(signData);
      }


      let url = this.config.baseURL + '/api/Notebook/DeleteNotebook';
      let fromData = new FormData();
      fromData.set('token', this.token!)
      fromData.set('id', id);
      fromData.set('dataSignJson', JSON.stringify(dataSign));
      let result = this.http.post<ApiRep>(url, fromData).subscribe(apiRe => {
        resolve(apiRe);
      });
    })

  }


}
