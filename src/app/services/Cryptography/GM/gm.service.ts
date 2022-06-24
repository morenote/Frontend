import { Injectable } from '@angular/core';
import {LogUtil} from "../../../shared/utils/log-util";
import {HexUtil} from "../../../shared/utils/hex-util";

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
  public  SM2Enc(msgString:string,publicKey:string):string{
    if (publicKey.length==128){
      publicKey="04"+publicKey;
    }
    const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
    let sm2 = require('sm-crypto').sm2
    LogUtil.log("加密数据="+msgString);
    LogUtil.log("公钥="+publicKey);
    LogUtil.log("密码算法=SM2-C1C3C2");
    let encryptData = sm2.doEncrypt(msgString, publicKey, cipherMode) // 加密结果
    return  encryptData;
  }
  public  SM2Dec(encryptData:string,privateKey:string):string{

    let sm2 = require('sm-crypto').sm2
    const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
    let decryptData = sm2.doDecrypt(encryptData, privateKey, cipherMode) // 解密结果
    return decryptData;
  }
  public SM4Enc(msg:string,key:string,iv:string):string{
    let sm4 = require('sm-crypto').sm4
    let encryptData = sm4.encrypt(msg, key,{mode:'cbc',iv:iv})
    return encryptData;
  }
  public SM4Dec(msg:string,key:string,iv:string):string{
    let sm4 = require('sm-crypto').sm4
    let decryptData  = sm4.decrypt(msg, key,{mode:'cbc',iv:iv})
    return decryptData ;
  }

  public  GetSM4Key():string{
    if ( localStorage.getItem("debug")=="1"){
      return  "00000000000000000000000000000000";
    }
    let arryBuffer=new Uint8Array(16);
    window.crypto.getRandomValues(arryBuffer);
    let hex= HexUtil.Uinit8ArrayToHex(arryBuffer);
    return hex;
  }
  public  GetIV(){
    if ( localStorage.getItem("debug")=="1"){
      return "00000000000000000000000000000000";
    }
    let arryBuffer=new Uint8Array(16);
    window.crypto.getRandomValues(arryBuffer);
    let hex= HexUtil.Uinit8ArrayToHex(arryBuffer);
    return hex;
  }



  constructor() { }
}
