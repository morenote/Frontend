/**
 * API返回数据
 */
export class ApiRep {
  public Id?: string;
  public Timestamp?: Date;

  public Ok?: boolean ;
  public Msg: string | undefined;
  public ErrorCode?: number;
  public Data: any;
}
