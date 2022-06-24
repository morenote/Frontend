import {PayLoadDTO} from "./pay-load-d-t-o";
import {GMService} from "../../../services/Cryptography/GM/gm.service";
import {LogUtil} from "../../../shared/utils/log-util";

export class DigitalEnvelope {
  public PayLoad?: string;
  public Key?: string;

  public SetPayLoad(paylod: PayLoadDTO, sm4Key: string, pKey: string) :void{
    LogUtil.log(`paylod=${paylod},key=${sm4Key},pKey=${pKey}`)
    let gm = new GMService();
    let json = JSON.stringify(paylod);
    this.PayLoad = gm.SM4Enc(json, sm4Key);
    this.Key = gm.SM2Enc(sm4Key, pKey);
  }

  public SetPayLodValue(value: string, key: string, pKey: string):void {
    LogUtil.log(`value=${value},key=${key},pKey=${pKey}`)
    let payLoad = new PayLoadDTO();
    payLoad.SetData(value);
    this.SetPayLoad(payLoad, key, pKey);
  }


}
