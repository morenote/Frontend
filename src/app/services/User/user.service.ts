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
import {DataSign} from "../../models/DTO/USBKey/data-sign";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {DigitalEnvelope} from "../../models/DTO/Api/digital-envelope";
import {LogUtil} from "../../shared/utils/log-util";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {PayLoadDTO} from "../../models/DTO/Api/pay-load-d-t-o";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userId?: string;
  token?: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public sjj1962: SJJ1962Service,
    private epass: EPass2001Service
  ) {
    let userToken = this.configService.GetUserToken();
    if (userToken != null) {
      this.userId = userToken.UserId;
      this.token = userToken.Token;
    }
    this.config = this.configService.GetWebSiteConfig();
    this.sc = configService.GetSecurityConfigDTOFromDB();
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
   * 获得用户实名身份信息
   * @constructor
   */
  public GetRealNameInformation(): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {

      //签名
      let signData = new SignData();
      let dataSign = new DataSign();
      if (this.sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = "/api/User/GetRealNameInformation";
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/User/GetRealNameInformation";
        signData.SM3Data("/api/User/GetRealNameInformation");
        dataSign = await this.epass.SendSignToePass2001(signData);
      }
      //数字信封
      let deJson = "";
      let gm = new GMService();
      let sm4Key = gm.GetSM4Key();
      let iv = gm.GetIV();
      if (this.sc.ForceDigitalEnvelope) {
        let digitalEnvelope = new DigitalEnvelope();
        digitalEnvelope.SetPayLodValue("/api/User/GetRealNameInformation", sm4Key, this.sc.PublicKey!, iv);
        deJson = JSON.stringify(digitalEnvelope);
        LogUtil.log(deJson);
      }


      let url = this.config.baseURL + '/api/User/GetRealNameInformation';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('digitalEnvelopeJson', deJson);
      formData.set('dataSignJson', JSON.stringify(dataSign));
      let result = this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        LogUtil.log("数字信封：" + JSON.stringify(apiRe));
        if (apiRe.Encryption) {
          LogUtil.log("payLod.加密数据=" + apiRe.Data)
          LogUtil.log("payLod.解密.sm4Key=" + sm4Key)
          LogUtil.log("payLod.解密.iv=" + iv)
          let payLodJson = gm.SM4Dec(apiRe.Data, sm4Key, iv);
          LogUtil.log("payLodJson：" + JSON.stringify(payLodJson));
          let temp = JSON.parse(payLodJson) as PayLoadDTO;
          let payLod = new PayLoadDTO();
          payLod.Data = temp.Data;
          payLod.Hash = temp.Hash;
          apiRe.Data = payLod.Data;
          apiRe.Ok = payLod.VerifyPayLodHash();
          LogUtil.log("payLod.Data=" + temp.Data)
          LogUtil.log("Hash.Hash=" + temp.Hash)
        }
        LogUtil.log("解密结果：" + JSON.stringify(apiRe));

        resolve(apiRe);
      })
    })
  }

  public SetRealNameInformation(sfz: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      //签名

      let signData = new SignData();
      let dataSign = new DataSign();
      if (this.sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = "";
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/User/SetRealNameInformation";
        signData.SM3Data(sfz);
        dataSign = await this.epass.SendSignToePass2001(signData);
      }


      //数字信封

      let deJson = "";
      if (this.sc.ForceDigitalEnvelope) {
        let gm = new GMService();
        let sm4Key = gm.GetSM4Key();
        let iv = gm.GetIV();
        let digitalEnvelope = new DigitalEnvelope();
        digitalEnvelope.SetPayLodValue(sfz, sm4Key, this.sc.PublicKey!, iv);
        deJson = JSON.stringify(digitalEnvelope);
        LogUtil.log(deJson);
      }
      let url = this.config.baseURL + '/api/User/SetRealNameInformation';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('digitalEnvelopeJson', deJson);
      formData.set('dataSignJson', JSON.stringify(dataSign));

      let result = this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      })

    })

  }

  /**
   * 通过邮箱获得用户详情
   * @constructor
   */
  public GetUserInfoByEmail(email: string): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/User/GetUserInfoByEmail';
      let httpParams = new HttpParams()
        .append('email', email!);
      let result = this.http.get<ApiRep>(url, {params: httpParams}).subscribe(apiRe => {
        resolve(apiRe);
      })
    })
  }

  public GetUserInfo(): Promise<User> {
    return new Promise<User>(resolve => {
      let url = this.config.baseURL + '/api/User/GetUserInfoByUserId';
      let httpParams = new HttpParams()
        .append('userId', this.userId!);
      let result = this.http.get<ApiRep>(url, {params: httpParams}).subscribe(apiRe => {
        if (apiRe.Ok) {
          resolve(apiRe.Data)
        } else {
          throw  new Error(apiRe.Msg);
        }
      })
    })
  }

  /**
   * 更新用户密码
   * @param oldPwd 用户旧密码
   * @param pwd 用户新密码
   * @constructor
   */
  public UpdatePwd(oldPwd: string, pwd: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let scDTO: SecurityConfigDTO;
      //获得服务器密码安全策略
      let apiRe = await this.configService.GetSecurityConfigDTO();
      if (apiRe != null && apiRe.Ok) {
        scDTO = apiRe.Data as SecurityConfigDTO;
        this.configService.SetSecurityConfigDTOFromDB(scDTO);
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

  /**
   * 用户注册
   * @param email 用户邮箱
   * @param pwd 用户口令
   * @constructor
   */
  public Register(email: string, pwd: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let scDTO: SecurityConfigDTO;
      //获得服务器密码安全策略
      let apiRe = await this.configService.GetSecurityConfigDTO();
      if (apiRe != null && apiRe.Ok) {
        scDTO = apiRe.Data as SecurityConfigDTO;
        //存储安全策略到数据库
        this.configService.SetSecurityConfigDTOFromDB(scDTO);
        //判断前端是否需要转加密
        pwd = this.sjj1962.TransferEncryptionIf(pwd, scDTO);
      } else {
        //返回失败
        resolve(apiRe);
        return;
      }
      let url = this.config.baseURL + '/api/Auth/Register';
      let formData = new FormData();
      formData.set('email', email);
      formData.set('pwd', pwd);
      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      })
    })
  }

  public UpdateUsername(username: string): Promise<ApiRep> {
    return new Promise<ApiRep>(resolve => {
      let url = this.config.baseURL + '/api/User/UpdateUsername';
      let formData = new FormData();
        formData.set('token', this.token!);
        formData.set('username', username);
        this.http.post<ApiRep>(url,formData).subscribe(apiRe=>{
          resolve(apiRe);
        })
    })
  }
}
