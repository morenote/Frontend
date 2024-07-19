import { inject, Inject, Injectable } from "@angular/core";

import { WebsiteConfig } from '../../models/config/website-config';
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {AuthService} from "../auth/auth.service";
import { HttpClient, HttpContext } from "@angular/common/http";
import {ApiRep} from "../../models/api/api-rep";
import {UserToken} from "../../models/DTO/user-token";
import {LocalStorageDBService} from "../data-storage/local-storage-db.service";
import {ALLOW_ANONYMOUS} from "@delon/auth";
import { HttpService } from "../Http/http.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  localhostUrl: string = "/localhost";
  private http: HttpService=inject(HttpService);
  private localStorageDBService:LocalStorageDBService=inject(LocalStorageDBService);
  constructor( ) {

  }
  public GetUserToken(): UserToken {
    let json = this.localStorageDBService.GetValue('AuthService-UserToken');
    return JSON.parse(json!) as UserToken;
  }
  public SetUserToken(userToken: UserToken) {
    this.localStorageDBService.SetValue('AuthService-UserToken', JSON.stringify(userToken));
  }

  /**
   * 清除缓存
   * @constructor
   */
  public ClearCache(){
    this.localStorageDBService.Remove("AuthService-UserToken");
    this.localStorageDBService.Remove("user");
    this.localStorageDBService.Remove("_token");
    this.localStorageDBService.Remove("SecurityConfigDTO");
  }

  public  GetSecurityConfigDTOFromDB():SecurityConfigDTO{
    let json= this.localStorageDBService.GetValue("SecurityConfigDTO");
    if (json!=null){
      let sc=JSON.parse(json) as SecurityConfigDTO;
      return  sc;
    }
    return  new SecurityConfigDTO();
  }
  public  SetSecurityConfigDTOFromDB(sc:SecurityConfigDTO){
    let json=JSON.stringify(sc);
    this.localStorageDBService.SetValue("SecurityConfigDTO",json);

  }



  public GetWebSiteConfig(): WebsiteConfig {
    let config = new WebsiteConfig();
    config.baseURL = '';
    //调试baseURL
    if (localStorage.getItem("url")!=null){
      config.baseURL = localStorage.getItem("url") as string;
    }
    //调试模式
    if (localStorage.getItem("localhost")!=null){
      config.baseURL="http://localhost:5000";
    }
    return config;
  }
  public GetSecurityConfigDTO():Promise<ApiRep>{
        return  new Promise<ApiRep>(resolve => {
          let config=this.GetWebSiteConfig();
          let url=config.baseURL+"/api/Config/GetSecurityConfig";
          this.http.get<ApiRep>(url,null,true).subscribe(apiRe=>{
            resolve(apiRe);
          })
        })
    }
  openWatermark():boolean {
      let sc=this.GetSecurityConfigDTOFromDB();
      return  sc.OpenWatermark!;
  }
}
