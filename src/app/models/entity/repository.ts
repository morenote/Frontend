import { RepositoryType } from "../enum/repository-type";
import {RepositoryOwnerType} from "../enum/repository-owner-type";

/**
 * 仓库  存储笔记或者文件
 */
 export class Repository {
  public Id: string | undefined;//仓库id
  public Name: string | undefined ;//仓库唯一名称
  public Avatar: string | undefined ;//Avatar
  public StarCounter: number | undefined ;//Avatar
  public ForkCounter: number | undefined ;//Avatar
  public Description: string | undefined ;//仓库摘要说明

  public License: string | undefined ;//开源协议
  public RepositoryType: RepositoryType | undefined ;//仓库类型 笔记仓库、文件仓库
  public RepositoryOwnerType: RepositoryOwnerType | undefined ;//仓库拥有者类型
  public OwnerId: string | undefined ;//开源协议
  public Visible: boolean | undefined ;//是否公开仓库
  public Usn: number | undefined ;// 版本号
  public CreateTime: Date | undefined ;//创建时间
  public IsDelete: boolean | undefined ;//是否被删除

  public VirtualFileBasePath: string | undefined ;//虚拟文件基础路径
  public VirtualFileAccessor: string | undefined ;//虚拟文件访问器
}
