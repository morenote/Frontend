import {Inject, Injectable} from '@angular/core';
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {LocalStorageDBService} from "../data-storage/local-storage-db.service";
import {Observable} from "rxjs";
import {ApiRep} from "../../models/api/api-rep";
import {HttpClient, HttpParams} from "@angular/common/http";
import {WebsiteConfig} from "../../models/config/website-config";
import {ConfigService} from "../config/config.service";
import {UserToken} from "../../models/DTO/user-token";
import {pbkdf2, pbkdf2Sync} from "crypto";
import * as hkdf from "futoin-hkdf";
import {AuthOk} from "../../models/api/auth-ok";
import {LoginSecurityPolicyLevel} from "../../models/enum/LoginSecurityPolicyLevel/login-security-policy-level";
import {UserService} from "../User/user.service";
import {SJJ1962Service} from "../Cryptography/sj1962/s-j-j1962.service";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {User} from "../../models/entity/user";
import {LogUtil} from "../../shared/utils/log-util";
import {Base64Util} from "../../shared/utils/base64-util";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db: LocalStorageDBService

  config: WebsiteConfig;


  public constructor(db: LocalStorageDBService,
                     public http: HttpClient,
                     public userService:UserService,
                     public sjj1962:SJJ1962Service,
                     public configService: ConfigService,
                     ) {
    this.db = db
    this.config = this.configService.GetWebSiteConfig();
  }

  /**
   * 通过用户口令登录
   * @param type
   * @param email
   * @param pwd
   * @param requestNumber
   * @constructor
   */
  public LoginByPassword(type: string, email: string, pwd: string,requestNumber:string): Promise<ApiRep> {
    return  new Promise<ApiRep>(async resolve => {
      let scDTO: SecurityConfigDTO;
      //获得服务器密码安全策略
      let apiRe = await this.configService.GetSecurityConfigDTO();
      if (apiRe != null && apiRe.Ok) {
        scDTO = apiRe.Data as SecurityConfigDTO;
        //存储到数据库
        this.configService.SetSecurityConfigDTOFromDB(scDTO);
      } else {
        //返回失败
        resolve(apiRe);
        return;
      }

      //获得用户密码算法
      apiRe = await this.userService.GetUserInfoByEmail(email);
      if (apiRe == null || !apiRe.Ok) {
        resolve(apiRe);
        LogUtil.log("GetUserInfoByEmail is error");
        return ;
      }
      let userInfo = apiRe.Data as User;
      pwd=this.sjj1962.TransferEncryptionIfUser(pwd,userInfo,scDTO);

      let url = this.config.baseURL + '/api/Auth/Login?_allow_anonymous=true';
      let formData = new FormData();
      formData.set('type', type!);
      formData.set('email', email!);
      formData.set('pwd', pwd);
      formData.set('requestNumber', requestNumber);
      let result = this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
          resolve(apiRe);
      })
    })
  }

  public TackNumber():Promise<string>{
    return  new Promise<string>(resolve => {
      let url = this.config.baseURL + '/api/Auth/TakeNumber?_allow_anonymous=true';
      let result = this.http.get<ApiRep>(url).subscribe(apiRe=>{
        if (apiRe!=null && apiRe.Ok){
          resolve(apiRe.Data);
        }else {
          throw Error("");
        }
      });
    })
  }



  public GetUserLoginSecurityPolicyLevel(email:string):Promise<LoginSecurityPolicyLevel>{
    return  new Promise<LoginSecurityPolicyLevel>((resolve)=>{
      let url = this.config.baseURL + '/api/Auth/GetUserLoginSecurityPolicyLevel?_allow_anonymous=true';
      let httpParams = new HttpParams()
        .append('email', email);
      let result = this.http.get<ApiRep>(url, {params: httpParams}).subscribe(apiRe=>{
        if (apiRe!=null && apiRe.Ok){
          return resolve(apiRe.Data);
        }else {
          throw Error("GetUserLoginSecurityPolicyLevel is Error");
        }
      });
    });
  }

  public  TakeToken(email:string,requestNumber:string):Promise<UserToken>{
    return  new Promise<UserToken>(resolve => {
      let url = this.config.baseURL + '/api/Auth/TakeToken';
      let formData = new FormData();
      formData.set('email', email);
      formData.set('requestNumber', requestNumber);
      this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
        if (apiRe!=null){
        return   resolve(apiRe.Data);
        }
      });



    })
  }

  // //派生密钥
  // public async keyDerivation(password: string, email: string) {
  //
  //   //主密钥
  //   var masterPassword=password;
  //   //主密钥
  //   var masterKey = pbkdf2Sync(password, email, 100_000, 256, "sha512");
  //   //扩展主密钥
  //   var strechedMasterKey = hkdf(masterKey, 512, {salt: email, hash: 'SHA-256'});
  //   //主密钥哈希
  //   var masterKeyHash = pbkdf2Sync(masterKey, password, 1, 256, "sha512")
  //
  //   //生成key
  //   let key = await crypto.subtle.generateKey({name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);
  //   let keyRaw=  crypto.subtle.exportKey("raw",key);
  //
  //
  //   //生成初始化向量
  //   const ivBuffer = new Uint32Array(8);
  //   crypto.getRandomValues(ivBuffer);
  //
  // }


  SetUserLoginSecurityPolicyLevel(level: LoginSecurityPolicyLevel) :Promise<ApiRep>{
    return  new Promise<ApiRep>((resolve)=>{
      let url = this.config.baseURL + '/api/Auth/SetUserLoginSecurityPolicyLevel';
      let formData = new FormData();
      formData.set('token', this.configService.GetUserToken().Token);
      formData.set('level', level.toString());

      this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
         resolve(apiRe);
      });


    })

  }
}
