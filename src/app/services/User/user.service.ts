import {Injectable} from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {Observable} from "rxjs";
import {ApiRep} from "../../models/api/api-rep";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {GMService} from "../Cryptography/GM/gm.service";
import {User} from "../../models/entity/user";
import {HexUtil} from "../../shared/utils/hex-util";
import {Base64} from "js-base64";
import {SJJ1962Service} from "../Cryptography/sj1962/s-j-j1962.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userId?: string | null;
  token?: string | null;
  config: WebsiteConfig;

  constructor(
              public http: HttpClient,
              public configService: ConfigService,
              public sjj1962: SJJ1962Service,
              ) {
    let userToken = this.configService.GetUserToken();
    if (userToken!=null){
      this.userId = userToken.UserId;
      this.token = userToken.Token;
    }
    this.config = this.configService.GetWebSiteConfig();
  }

  /**
   * 获得当前已登录用户的详情
   * @constructor
   */
  public GetUserInfoByToken(): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/User/GetUserInfoByToken';
      let httpParams = new HttpParams()
        .append('token', this.token!);
      let result = this.http.get<ApiRep>(url, {params: httpParams}).subscribe(apiRe => {
        resolve(apiRe);
      })
    })
  }

  /**
   * 通过邮箱获得用户详情
   * @constructor
   */
  public GetUserInfoByEmail(email:string): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/User/GetUserInfoByEmail';
      let httpParams = new HttpParams()
        .append('email', email!);
      let result = this.http.get<ApiRep>(url, {params: httpParams}).subscribe(apiRe => {
        resolve(apiRe);
      })
    })
  }

  public UpdatePwd(oldPwd: string, pwd: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let scDTO: SecurityConfigDTO;
      //获得服务器密码安全策略
      let apiRe = await this.configService.GetSecurityConfigDTO();
      if (apiRe != null && apiRe.Ok) {
        scDTO = apiRe.Data as SecurityConfigDTO;
        //判断前端是否需要转加密
        pwd = this.sjj1962.TransferEncryptionIf(pwd, scDTO);
      } else {
        //返回失败
        resolve(apiRe);
        return;
      }
      //获得用户信息
      apiRe = await this.GetUserInfoByToken();
      if (apiRe != null && apiRe.Ok) {
        let userInfo = apiRe.Data as User;
        //判断旧密码是否需要转加密
        oldPwd = this.sjj1962.TransferEncryptionIfUser(oldPwd, userInfo, scDTO);
      } else {
        //返回失败
        resolve(apiRe)
        return;
      }
      //base64处理

      //更新密码


      let url = this.config.baseURL + '/api/User/UpdatePwd';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('oldPwd', oldPwd);
      formData.set('pwd', pwd);
      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      })
    })
  }


}
