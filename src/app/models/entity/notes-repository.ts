import { RepositoryType } from "../enum/repository-type";

/**
 * 笔记仓库
 */
 export class NotesRepository {
  public Id: string | undefined;//仓库id
  public Name: string | undefined ;//仓库唯一名称
  public Avatar: string | undefined ;//Avatar
  public StarCounter: number | undefined ;//Avatar
  public ForkCounter: number | undefined ;//Avatar
  public Description: string | undefined ;//仓库摘要说明

  public License: string | undefined ;//开源协议
  public RepositoryOwnerType: RepositoryType | undefined ;//开源协议
  public OwnerId: string | undefined ;//开源协议
  public Visible: boolean | undefined ;//是否公开仓库
  public Usn: number | undefined ;// 版本号
  public CreateTime: Date | undefined ;//创建时间
  public IsDelete: boolean | undefined ;//是否被删除
}
