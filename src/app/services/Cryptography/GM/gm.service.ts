import { Injectable } from '@angular/core';

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
    let len=msgString;
    let lenStr=len+"";
    if (lenStr.length<2){
      lenStr="0"+lenStr;
    }
    if (lenStr.length>2){
      throw  new Error("GMService.TransferEncryption:msgString len > 99 ");
    }
    msgString=lenStr+msgString;
    let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode) // 加密结果
    return  encryptData;
  }
  constructor() { }
}
