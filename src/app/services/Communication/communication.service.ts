import {Injectable} from '@angular/core';
import {ApiRep} from "../../models/api/api-rep";
import {Hash} from "crypto";
import { HttpClient } from "@angular/common/http";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {SnowFlake} from "../../shared/utils/snow-flake";
import {DigitalEnvelope} from "../../models/DTO/Api/digital-envelope";
import {ConfigService} from "../config/config.service";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {DataSign} from "../../models/DTO/USBKey/data-sign";
import {GMService} from "../Cryptography/GM/gm.service";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";

@Injectable({
  providedIn: 'root'
})
/**
 * 通讯服务层
 */
export class CommunicationService {
  public baseURL?: string;
  public url?: string;
  public userId?: string;
  public data?: Map<string, any>;
  digitalEnvelope?: DigitalEnvelope;
  token?: string;
  sc!:SecurityConfigDTO;
  dataSign?:DataSign;


  public constructor(public configService: ConfigService,
                     public ePass2001Service:EPass2001Service,
                     public http: HttpClient) {
    let config=  this.configService.GetUserToken();
    this.userId=config.UserId;
    this.sc=configService.GetSecurityConfigDTOFromDB();
    this.baseURL = configService.GetWebSiteConfig().baseURL;
  }

  //设置操作员
  public setUserId(userId: string): CommunicationService {
    this.userId = userId;
    return this;
  }

  //修改后台URL
  public setBaseURL(baseURL: string): CommunicationService {
    this.url = baseURL;
    return this;
  }
  //设置业务路由URL
  public setURL(url: string): CommunicationService {
    this.url = url;
    return this;
  }

  //添加业务数据
  public addData(mapData: Map<string, any>): CommunicationService {
    this.data = mapData;
    return this;
  }

  /**
   * 添加签名数据
   * @param data
   * @param bigData
   */
  public async addSign(data: string, bigData: string): Promise<CommunicationService> {
    if (bigData == null) {
      bigData = "";
    }
    if (data == null) {
      data = "";
    }
    let signData = new SignData();
    signData.Id = SnowFlake.NexHexId();
    signData.UserId = this.userId;
    signData.Data = data;
    signData.UinxTime = Math.round(new Date().getTime() / 1000);
    signData.Operate = this.url;
    signData.SM3Data(bigData);

    this.dataSign = await this.ePass2001Service.SendSignToePass2001(signData);
    return this;
  }


  /**
   * 使用数字信封对报文进行保护
   * @param encryptedField
   */
  public addDigitalEnvelope() {
    this.digitalEnvelope = new DigitalEnvelope();
    let gm=new GMService();
    let sm4Key=gm.GetSM4Key();
    let iv=gm.GetIV();
    let digitalEnvelope =new DigitalEnvelope();
    digitalEnvelope.SetPayLodValue("",sm4Key,this.sc.PublicKey!,iv);
    let deJson= JSON.stringify(digitalEnvelope);

    return this;
  }

  /**
   * 通讯层产生一个http-post请求
   * @param mapData
   * @param url
   * @param encryptedField
   * @param needSign
   */
  public post(mapData: Map<string, any>, url: string, encryptedField: string, needSign: boolean): Promise<ApiRep> {
    return new Promise<ApiRep>((resolve) => {
      //数字信封
      if (encryptedField != null) {
        let plainData = mapData.get(encryptedField);//默认需要加密的字段都是字符串
      }
      //if sgin
      if (needSign) {

      }
    })
  }


}
