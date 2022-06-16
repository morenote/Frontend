import { Injectable } from '@angular/core';

import { WebsiteConfig } from '../../models/config/website-config';
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ApiRep} from "../../models/api/api-rep";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  localhostUrl: string = "/localhost";

  constructor( public http: HttpClient) {




  }


  public GetWebSiteConfig(): WebsiteConfig {
    let config = new WebsiteConfig();
    config.baseURL = 'https://localhost:5001';
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
