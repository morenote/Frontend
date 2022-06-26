import { Injectable } from '@angular/core';

import { WebsiteConfig } from '../../models/config/website-config';
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ApiRep} from "../../models/api/api-rep";
import {UserToken} from "../../models/DTO/user-token";
import {LocalStorageDBService} from "../data-storage/local-storage-db.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  localhostUrl: string = "/localhost";

  constructor( public http: HttpClient,private localStorageDBService: LocalStorageDBService) {

  }
  public GetUserToken(): UserToken {
    let json = this.localStorageDBService.GetValue('AuthService-UserToken');
    return JSON.parse(json!);
  }
  public SetUserToken(userToken: UserToken) {
    this.localStorageDBService.SetValue('AuthService-UserToken', JSON.stringify(userToken));
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
    config.baseURL = 'https://api.morenote.top';
    return config;
  }
  public GetSecurityConfigDTO():Promise<ApiRep>{
        return  new Promise<ApiRep>(resolve => {
          let config=this.GetWebSiteConfig();
          let url=config.baseURL+"/api/Config/GetSecurityConfig";
          this.http.get<ApiRep>(url).subscribe(apiRe=>{
            resolve(apiRe);
          })
        })
    }


}
