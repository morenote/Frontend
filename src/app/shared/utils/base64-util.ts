import {Base64} from "js-base64";

export class Base64Util {
  /**
   * 字节数组转base64
   * @param u8s
   * @constructor
   */
  public  static  Uint8ArrayToBase64(u8s:Uint8Array):string{
    return  Base64.fromUint8Array(u8s);
  }

  /**
   * base64字符串转字节数组
   * @param base64Str
   * @constructor
   */
  public  static Base64ToUint8Array(base64Str:string):Uint8Array{

    return  Base64.toUint8Array(base64Str);

  }
}
