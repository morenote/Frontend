export class ClientResponse {
  public Id?:string;//挑战id UUID 流水号
  public Tag?:string;//标签，标识其用途
  public Random?:string;//随机数  16字节
  public Time?:string;//挑战时间 unix时间戳
  public env?:string;//客户端环境信息(反欺诈)
  public cer?:string;//客户端证书
  public sign?:string;//客户端签名 对所以上面的信息依次做签名
  
}
