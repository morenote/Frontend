import {SnowflakeIdGenerate} from "../../helpers/SnowflakeIdGenerate";
import {SignType} from "../enum/sign-type";
import {AsymmetricEncryptionAlgorithm} from "../enum/asymmetric-encryption-algorithm";

export class ApiReq {

  constructor() {
    let idGenerate: SnowflakeIdGenerate = new SnowflakeIdGenerate();
    this.Id=idGenerate.generate().toString(16);
    this.Timestamp= Math.floor(Date.now() / 1000).toString();

  }
  public Id!:string;//消息唯一id
  public Timestamp!:string;//时间戳
  public AccessId!:string;//访问凭据ID
  public ClientId!:string;//客户端ID
  public Data!:string;//请求数据
  public DataKey!:string;//请求数据
  public SignType!:SignType;//请求数据
  public AsyAlgorithm!:AsymmetricEncryptionAlgorithm;//非对称加密算法
  public Sign!:string;//签名


}
