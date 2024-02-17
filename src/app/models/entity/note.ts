import {SignData} from "../DTO/USBKey/sign-data";
import {ExtendedNameEnum} from "../enum/extended-name-enum";

export class Note {
  public  Id!:string;
  public  UserId?:string;
  public  NotesRepositoryId?:string;
  public  CreatedUserId?:string;
  public  NotebookId?:string;
  public  Title!:string;
  public  Desc?:string;
  public  Src?:string;
  public  ImgSrc?:string;
  public  Tags?:Array<string>;
  public  IsTrash?:boolean;
  public  IsBlog?:boolean;
  public  UrlTitle?:string;
  public  IsRecommend?:boolean;
  public  IsTop?:boolean;
  public  HasSelfDefined?:boolean;
  public  ReadNum?:number;
  public  LikeNum?:number;
  public  CommentNum?:number;
  // public  IsMarkdown?:boolean;
  public  ExtendedName?:ExtendedNameEnum;
  public  AttachNum?:number;
  public  CreatedTime?:Date;
  public  UpdatedTime?:Date;
  public  RecommendTime?:Date;
  public  PublicTime?:Date;
  public  Usn?:number;
  public  IsDeleted?:boolean;
  public  IsPublicShare?:boolean;
  public  ContentId?:string;
  public  AccessPassword?:string;


}
