import {GMService} from "../../../services/Cryptography/GM/gm.service";

export class SignData {
  public Id?:String;
  public Data?:string;
  public  Hash?:String="";
  public  UserId?:string;
  public  Tag?:string;
  public  UinxTime?:number;
  public  Operate?:string;

  public  SM3Data(data:string){
    let gmService=new GMService();
     this.Hash=gmService.SM3(data);

  }
}
