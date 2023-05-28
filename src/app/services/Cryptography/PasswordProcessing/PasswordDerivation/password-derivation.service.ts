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

  /**
   *
   * @param pwd
   * @param user
   * @param scDto
   * @constructor
   */
  async TransferEncryptionIfUser(pwd: string, user: UserInfo, scDto: SecurityConfigDTO): Promise<string> {
    //首先派生主密钥 使用PBKDF-SHA256
    let encoder = new TextEncoder();
    let passphraseKey = encoder.encode(pwd);//口令明文
    let saltBuffer = encoder.encode(user.Id);//用户id
    let cryptoKey = await window.crypto.subtle.importKey('raw', passphraseKey, {name: "PBKDF2"}, false, ['deriveBits', 'deriveKey']);
    //todo：由于js实现的GM算法性能太低了，所以PBKDF使用的是SHA256的PBKDF2算法
    let masterKey = await window.crypto.subtle.deriveKey(
      {
        "name": 'PBKDF2',
        "salt": saltBuffer,
        "iterations": 1_000_000,
        "hash": 'SHA-256'
      },
      cryptoKey,
      {"name": 'AES-CBC', "length": 256},
      true,
      ["encrypt", "decrypt"]
    );
    let exportMasterKey = await crypto.subtle.exportKey("raw", masterKey);
    //派生加密密钥
    let encInfoBuffer = encoder.encode("enc");//用户id
    let encKey = await window.crypto.subtle.deriveBits(
      {
        name: "HKDF",
        salt: saltBuffer,
        info: encInfoBuffer,
        hash: "SHA-256",
      },
      masterKey,
      16
    );
    //派生认证密钥
    let macInfoBuffer= encoder.encode("mac");//用户id
    let macKey=await  window.crypto.subtle.deriveBits(
      {
        name: "HKDF",
        salt: saltBuffer,
        info: macInfoBuffer,
        hash: "SHA-256",
      },
      masterKey,
      16
    )
    let exportMasterKeyBase64 = Base64.encode(pwd);
    return Base64.fromUint8Array(new Uint8Array(macKey));
  }
}
