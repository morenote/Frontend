import { Injectable } from '@angular/core';
import {GMService} from "../../GM/gm.service";
import {SecurityConfigDTO} from "../../../../models/DTO/Config/SecurityConfig/security-config-dto";
import {LogUtil} from "../../../../shared/utils/log-util";
import {HexUtil} from "../../../../shared/utils/hex-util";
import {Base64} from "js-base64";
import {UserInfo} from "../../../../models/entity/userInfo";
import {PasswordAnswering} from "../password-answering";


@Injectable({
  providedIn: 'root'
})
export class SJJ1962Service {

  constructor(public  gm:GMService) { }
  public  TransferEncryptionIf(pwd:string,scDto:SecurityConfigDTO):string{
    if (scDto.PasswordHashAlgorithm=="sjj1962"){
      pwd=pwd.padEnd(16,"0");
      LogUtil.log("pwd_padEnd="+pwd);
      let enc=this.gm.TransferEncryption(pwd,scDto.TransEncryptedPublicKey!);
      console.log("hex="+enc)
      enc=HexUtil.hexToBase64(enc);
      return  enc;
    }
    pwd=Base64.encode(pwd);
    return  pwd;
  }

  /**
   * 对用户的口令处理
   * @param pwd
   * @param user
   * @param scDto
   * @constructor
   */
  public  TransferEncryptionIfUser(pwd:string, user:UserInfo, scDto:SecurityConfigDTO):Promise<string>{
  return  new Promise(resolve => {
    if (user.PasswordHashAlgorithm=="sjj1962"){
      pwd=pwd.padEnd(16,"0");
      LogUtil.log("pwd_padEnd="+pwd);
      let enc=this.gm.TransferEncryption(pwd,scDto.TransEncryptedPublicKey!);
      enc=HexUtil.hexToBase64(enc);
      resolve(enc);
    }
    pwd=Base64.encode(pwd);
    resolve(pwd);
  })

  }
}
