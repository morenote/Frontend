import {Inject, Injectable} from '@angular/core';
import {ALLOW_ANONYMOUS, DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {LocalStorageDBService} from "../data-storage/local-storage-db.service";
import {Observable} from "rxjs";
import {ApiRep} from "../../models/api/api-rep";
import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import {WebsiteConfig} from "../../models/config/website-config";
import {ConfigService} from "../config/config.service";
import {UserToken} from "../../models/DTO/user-token";

import {LoginSecurityPolicyLevel} from "../../models/enum/LoginSecurityPolicyLevel/login-security-policy-level";
import {UserService} from "../User/user.service";

import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";

import { SJJ1962Service } from "../Cryptography/PasswordProcessing/sj1962/s-j-j1962.service";



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
   * 通过用户口令挑战系统
   * @param type
   * @param email
   * @param pwd
   * @param session
   * @constructor
   */
  public PasswordChallenge(type: string, email: string, pwd: string, sessionCode:string): Promise<ApiRep> {
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
      let userInfo = await this.userService.GetUserInfoByEmail(email);


      pwd=await  this.sjj1962.TransferEncryptionIfUser(pwd,userInfo,scDTO);

      let url = this.config.baseURL + '/api/Auth/PasswordChallenge';
      let formData = new FormData();
      formData.set('type', type!);
      formData.set('email', email!);
      formData.set('pwd', pwd);
      formData.set('sessionCode', sessionCode);
      let result = this.http.post<ApiRep>(url, formData,{ context: new HttpContext().set(ALLOW_ANONYMOUS, true)}).subscribe(apiRe=>{
          resolve(apiRe);
      })
    })
  }

  /**
   * 获取Session号码用于维护会话状态
   * @constructor
   */
  public TakeSessionCode():Promise<string>{
    return  new Promise<string>(resolve => {
      let url = this.config.baseURL + '/api/Auth/Session';
      let result = this.http.get<ApiRep>(url,{context:new HttpContext().set(ALLOW_ANONYMOUS,true)}).subscribe(apiRe=>{
        if (apiRe!=null && apiRe.Ok){
          resolve(apiRe.Data);
        }else {
          throw Error("");
        }
      });
    })
  }


  /**
   * 获取用户登录设置
   * @param email
   * @constructor
   */
  public GetUserLoginSettings(email:string):Promise<LoginSecurityPolicyLevel>{
    return  new Promise<LoginSecurityPolicyLevel>((resolve)=>{
      let url = this.config.baseURL + '/api/Auth/UserLoginSettings';
      let httpParams = new HttpParams()
        .append('email', email);
      let result = this.http.get<ApiRep>(url, {params: httpParams,context:new HttpContext().set(ALLOW_ANONYMOUS,true)}).subscribe(apiRe=>{
        if (apiRe!=null && apiRe.Ok){
          return resolve(apiRe.Data);
        }else {
          throw Error("GetUserLoginSecurityPolicyLevel is Error");
        }
      });
    });
  }

  /**
   * 提交登录，并获得token
   * token获取后，sission号码失效
   * @param email
   * @param sessionCode
   * @constructor
   */
  public  SubmitLogin(email:string, sessionCode:string):Promise<UserToken>{
    return  new Promise<UserToken>(resolve => {
      let url = this.config.baseURL + '/api/Auth/SubmitLogin';
      let formData = new FormData();
      formData.set('email', email);
      formData.set('sessionCode', sessionCode);
      this.http.post<ApiRep>(url, formData,{context: new HttpContext().set(ALLOW_ANONYMOUS, true)}).subscribe(apiRe=>{
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


  SetUserLoginSettings(level: LoginSecurityPolicyLevel) :Promise<ApiRep>{
    return  new Promise<ApiRep>((resolve)=>{
      let url = this.config.baseURL + '/api/Auth/SetUserLoginSettings';
      let formData = new FormData();
      formData.set('token', this.configService.GetUserToken().Token);
      formData.set('level', level.toString());

      this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
         resolve(apiRe);
      });


    })

  }
}
