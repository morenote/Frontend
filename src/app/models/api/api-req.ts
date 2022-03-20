export class ApiReq {
  public TokenId!:string;//签名的tokenId
  public Data: string | undefined;//数据
  public Timestamp!:number;//时间戳
  public Salt!:string;//随机数
  public Encryption:boolean=false;//Data数据是否被加密
  public Sign!:string;//使用token签名

}
