import { Injectable } from '@angular/core';
import {SecurityConfigDTO} from "../../../models/DTO/Config/SecurityConfig/security-config-dto";
import {HexUtil} from "../../../shared/utils/hex-util";
import {Base64} from "js-base64";
import {User} from "../../../models/entity/user";
import {GMService} from "../GM/gm.service";
import {LogUtil} from "../../../shared/utils/log-util";

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

  public  TransferEncryptionIfUser(pwd:string,user:User,scDto:SecurityConfigDTO):string{

    if (user.PasswordHashAlgorithm=="sjj1962"){
      pwd=pwd.padEnd(16,"0");
      LogUtil.log("pwd_padEnd="+pwd);
      let enc=this.gm.TransferEncryption(pwd,scDto.TransEncryptedPublicKey!);
      enc=HexUtil.hexToBase64(enc);
      return  enc;
    }
    pwd=Base64.encode(pwd);
    return  pwd;
  }
}
