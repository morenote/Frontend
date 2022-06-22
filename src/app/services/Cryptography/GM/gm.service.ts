import { Injectable } from '@angular/core';
import {LogUtil} from "../../../shared/utils/log-util";

@Injectable({
  providedIn: 'root'
})
/**
 * 国密算法加密服务
 */
export class GMService {
  public  TransferEncryption(msgString:string,publicKey:string):string {

    if (publicKey.length==128){
      publicKey="04"+publicKey;
    }
    const sm2 = require('sm-crypto').sm2
    const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
    let len=msgString.length;
    let lenStr=len+"";
    if (lenStr.length<2){
      lenStr="0"+lenStr;
    }
    if (lenStr.length>99){
      throw  new Error("GMService.TransferEncryption:msgString len > 99 ");
    }
    msgString=lenStr+msgString;
    LogUtil.log("加密数据="+msgString);

    LogUtil.log("公钥="+publicKey);
    LogUtil.log("密码算法=SM2-C1C3C2");
    let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode) // 加密结果
    return  encryptData;
  }

  public  SM3(data:string ):string{
    let sm3 = require('sm-crypto').sm3
    return sm3(data);
  }
  constructor() { }
}
