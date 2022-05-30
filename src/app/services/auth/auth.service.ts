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


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db: LocalStorageDBService

  config: WebsiteConfig;


  public constructor(db: LocalStorageDBService,
                     public http: HttpClient,
                     public configService: ConfigService,
                     private localStorageDBService: LocalStorageDBService) {
    this.db = db
    this.config = this.configService.GetWebSiteConfig();
  }


  public SetUserToken(userToken: UserToken) {
    this.localStorageDBService.SetValue('AuthService-UserToken', JSON.stringify(userToken));
  }

  public GetUserToken(): UserToken {
    let json = this.localStorageDBService.GetValue('AuthService-UserToken');
    return JSON.parse(json!);
  }


  public LoginByPassword(type: string, email: string, pwd: string): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Auth/Login?_allow_anonymous=true';
    let formData = new FormData();
    formData.set('type', type!);
    formData.set('email', email!);
    formData.set('pwd', pwd);
    let result = this.http.post<ApiRep>(url, formData);
    return result;

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


}
