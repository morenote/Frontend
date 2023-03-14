import {Injectable} from '@angular/core';
import {PasswordAnswering} from "../password-answering";
import {UserInfo} from "../../../../models/entity/userInfo";
import {SecurityConfigDTO} from "../../../../models/DTO/Config/SecurityConfig/security-config-dto";
import {Base64} from "js-base64";

@Injectable({
  providedIn: 'root'
})
export class PasswordDerivationService implements PasswordAnswering {

  constructor() {
  }

  async TransferEncryptionIfUser(pwd: string, user: UserInfo, scDto: SecurityConfigDTO): Promise<string> {
    //首先派生主密钥
    let encoder = new TextEncoder();
    let passphraseKey = encoder.encode(pwd);//口令明文
    let saltBuffer = encoder.encode(user.Id);//用户id
    let cryptoKey = await window.crypto.subtle.importKey('raw', passphraseKey, {name: "PBKDF2"}, false, ['deriveBits', 'deriveKey']);
    let webKey = await window.crypto.subtle.deriveKey(
      {
        "name": 'PBKDF2',
        "salt": saltBuffer,
        "iterations": 1000000,
        "hash": 'SHA-256'
      },
      cryptoKey,
      {"name": 'AES-CBC', "length": 256},
      true,
      ["encrypt", "decrypt"]
    );
    let exportKey = crypto.subtle.exportKey("raw", webKey);
    let masterKey = Base64.encode(pwd);
    return  masterKey;
  }
}
