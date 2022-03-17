import { RepositoryType } from "../enum/repository-type";

/**
 * 笔记仓库
 */
 export class NotesRepository {
  public NotesRepositoryId: string | undefined;//仓库id
  public NotesRepositoryName: string | undefined ;//仓库唯一名称
  public NotesRepositorySummary: string | undefined ;//仓库摘要说明
  public NotesRepositoryLicense: string | undefined ;//开源协议
  public RepositoryType: RepositoryType | undefined ;//开源协议
  public OwnerId: string | undefined ;//开源协议
  public Visible: boolean | undefined ;//开源协议
}
