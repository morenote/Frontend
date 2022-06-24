import {GMService} from "../../../services/Cryptography/GM/gm.service";

export class PayLoadDTO {
  public Data?: string;
  public Hash?: string;

  public SetData(data: string):void {
    let gm = new GMService();
    this.Data = data;
    this.Hash = gm.SM3(data);
  }
  public  VerifyPayLodHash():boolean{
    let gm = new GMService();
    let sm3=gm.SM3(this.Data!);
    return  sm3.toUpperCase()==this.Hash?.toUpperCase();
  }
}
