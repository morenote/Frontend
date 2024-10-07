import {Injectable} from '@angular/core';
import {ApiRep} from "../../models/api/api-rep";
import {Hash} from "crypto";
import { HttpClient, HttpContext, HttpHeaders } from "@angular/common/http";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {SnowFlake} from "../../shared/utils/snow-flake";
import {DigitalEnvelope} from "../../models/DTO/Api/digital-envelope";
import {ConfigService} from "../config/config.service";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {DataSign} from "../../models/DTO/USBKey/data-sign";
import {GMService} from "../Cryptography/GM/gm.service";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import { ALLOW_ANONYMOUS } from "@delon/auth";
import { LogUtil } from "../../shared/utils/log-util";
import { PayLoadDTO } from "../../models/DTO/Api/pay-load-d-t-o";
import { da } from "date-fns/locale";

@Injectable({
  providedIn: 'root'
})
/**
 * 通讯服务层
 */
export class TelegramService {
  public baseURL: string="";
  public url: string="";

  public userId?: string;
  public data: Map<string, any>=new Map<string, any>();
  digitalEnvelope?: DigitalEnvelope;
  token?: string;
  sc!:SecurityConfigDTO;
  dataSign?:DataSign;

  httpContext=new HttpContext();
  headers = new HttpHeaders();

  sm4Key:string="";
  iv:string="";

  public constructor(public configService: ConfigService,
                     public ePass2001Service:EPass2001Service,
                     public http: HttpClient) {
    let config=  this.configService.GetUserToken();
    this.userId=config.UserId;
    this.sc=configService.GetSecurityConfigDTOFromDB();
    this.baseURL = configService.GetWebSiteConfig().baseURL;
  }


  /**
   * 设置匿名访问呢
   */
  public  setAnonymous(): TelegramService{
    if (ALLOW_ANONYMOUS){
     this.httpContext= this.httpContext.set(ALLOW_ANONYMOUS,true)
    }
    return  this;
  }

  //设置操作员
  public setUserId(userId: string): TelegramService {
    this.userId = userId;
    return this;
  }

  //修改后台URL
  public setBaseURL(baseURL: string): TelegramService {
    this.url = baseURL;
    return this;
  }
  //设置业务路由URL
  public setURL(url: string): TelegramService {
    this.url = url;
    return this;
  }
  public  getFullURL():string{
    return  this.baseURL+this.url;
  }

  //添加业务数据
  public setData(mapData: Map<string, any>): TelegramService {
    this.data = mapData;
    return this;
  }



  /**
   * 添加签名数据
   * @param key
   */
  public async addSign( key: string): Promise<TelegramService> {
    let signData = new SignData();
    signData.Id ="";
    signData.UserId = this.userId;
    signData.Data = "";
    signData.UinxTime = Math.round(new Date().getTime() / 1000);
    signData.Operate = this.url;
    signData.SM3Data(this.data?.get(key));

    this.dataSign = await this.ePass2001Service.SendSignToePass2001(signData);
    this.headers=this.headers.set("sign_field",key);
    this.headers=this.headers.set("sign",JSON.stringify(this.dataSign));
    return this;
  }

  /**
   * 使用数字信封对报文进行保护
   * @param encryptedField
   */
  public addDigitalEnvelope(key: string): TelegramService {
    this.digitalEnvelope = new DigitalEnvelope();
    let gm=new GMService();
    this.sm4Key=gm.GetSM4Key();
    this.iv=gm.GetIV();
    let digitalEnvelope =new DigitalEnvelope();
    digitalEnvelope.SetPayLodValue(this.data?.get(key),this.sm4Key,this.sc.PublicKey!,this.iv);
    let deJson= JSON.stringify(digitalEnvelope);
    this.data.set(key,"");
    this.data?.set("digitalEnvelopeJson",deJson);
    this.headers=this.headers.set("enc_field",key);
    return this;
  }

  /**
   * 通讯层产生一个http-post请求
   */
  public post<T>(): Promise<ApiRep> {
    return new Promise<ApiRep>((resolve) => {
      let body=new FormData();
      for (const key of this.data?.keys()) {
        body.set(key,this.data?.get(key));
      }
      this.http.post<ApiRep>(this.getFullURL(),body,{context:this.httpContext,headers:this.headers}).subscribe(apiRe=>{
        LogUtil.log("数字信封：" + JSON.stringify(apiRe));
        if (apiRe.Encryption) {
          let gm=new GMService();
          LogUtil.log("payLod.加密数据=" + apiRe.Data)
          LogUtil.log("payLod.解密.sm4Key=" + this.sm4Key)
          LogUtil.log("payLod.解密.iv=" + this.iv)
          let payLodJson = gm.SM4Dec(apiRe.Data, this.sm4Key, this.iv);
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
      });
    })
  }


}
