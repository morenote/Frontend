/**
 * 服务器挑战
 */
export class ServerChallenge {
  public Id?:string;//挑战id UUID 流水号
  public UserId?:string;//用户Id
  public Tag?:string;//标签，标识其用途
  public RequestNumber?:string;//客户端请求序列号，每次客户端会使用不同的序列号
  public Random?:string;//随机数  32字节
  public UinxTime?:number;//挑战时间 unix时间戳

}
