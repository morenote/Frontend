/**
 * 服务器挑战
 */
export class ServerChallenge {
  public Id?:string;//挑战id UUID 流水号
  public UserId?:string;//用户Id
  public Tag?:string;//标签，标识其用途
  public Random?:string;//随机数  32字节
  public UinxTime?:number;//挑战时间 unix时间戳

}
