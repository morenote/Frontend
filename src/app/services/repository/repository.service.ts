import {Injectable} from '@angular/core';
import {Repository} from "../../models/entity/repository";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";
import {WebsiteConfig} from "../../models/config/website-config";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {DataSign} from "../../models/DTO/USBKey/data-sign";
import {RepositoryType} from "../../models/enum/repository-type";

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

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


  /**
   *  获得我的笔记仓库列表
   * @constructor
   */
  public GetMyRepository(repositoryType:RepositoryType): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Repository/GetMyRepository';
    let queryParams = new HttpParams()
      .append('userId', (this.userId)!)
      .append('userId', (this.userId)!)
      .append('repositoryType', repositoryType)
      .append('token', this.token);
    let result = this.http.get<ApiRep>(url, {params: queryParams});
    return result;
  }

  public CreateRepository(repository: Repository): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let signData = new SignData();
      let dataSign=new DataSign();
      if (this.sc.ForceDigitalSignature){
        signData.Id = "";
        signData.Data = JSON.stringify(repository);
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/Repository/CreateRepository";
        dataSign = await this.epass.SendSignToePass2001(signData);
      }

      let url = this.config.baseURL + '/api/Repository/CreateRepository';
      let fromData = new FormData()
      fromData.set('token', this.token!)
      fromData.set('data', JSON.stringify(repository));
      fromData.set('dataSignJson', JSON.stringify(dataSign));
      let result = this.http.post<ApiRep>(url, fromData).subscribe(apiRe => {
        resolve(apiRe);
      })


    });

  }

  public DeleteRepository(repositoryId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let signData = new SignData();
      let dataSign = new DataSign();

      if (this.sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = repositoryId;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/Repository/DeleteRepository";

        dataSign = await this.epass.SendSignToePass2001(signData);
      }


      let url = this.config.baseURL + '/api/Repository/DeleteRepository';
      let fromData = new FormData();
      fromData.set('token', this.token!)
      fromData.set('repositoryId', repositoryId);
      fromData.set('dataSignJson', JSON.stringify(dataSign));
      let result = this.http.post<ApiRep>(url, fromData).subscribe(apiRe => {
        resolve(apiRe);
      });


    })

  }


}
