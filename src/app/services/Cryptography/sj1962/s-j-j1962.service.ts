import { Injectable } from '@angular/core';
import {SecurityConfigDTO} from "../../../models/DTO/Config/SecurityConfig/security-config-dto";
import {HexUtil} from "../../../shared/utils/hex-util";
import {Base64} from "js-base64";
import {User} from "../../../models/entity/user";
import {GMService} from "../GM/gm.service";

@Injectable({
  providedIn: 'root'
})
export class SJJ1962Service {

  constructor(public  gm:GMService) { }
  public  TransferEncryptionIf(pwd:string,scDto:SecurityConfigDTO):string{
    if (scDto.PasswordHashAlgorithm=="sjj1962"){
      let enc=this.gm.TransferEncryption(pwd,scDto.PublicKey!);
      console.log("hex="+enc)
      enc=HexUtil.hexToBase64(enc);
      return  enc;
    }
    pwd=Base64.encode(pwd);
    return  pwd;
  }

  public  TransferEncryptionIfUser(pwd:string,user:User,scDto:SecurityConfigDTO):string{
    if (user.PasswordHashAlgorithm=="sjj1962"){
      pwd=pwd.padEnd(64,"0");
      let enc=this.gm.TransferEncryption(pwd,scDto.PublicKey!);
      enc=HexUtil.hexToBase64(enc);
      return  enc;
    }
    pwd=Base64.encode(pwd);
    return  pwd;
  }
}
