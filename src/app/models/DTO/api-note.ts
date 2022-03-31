import {Note} from "../entity/note";

export class ApiNote {
  public NoteId?:string;
  public NotebookId?:string;
  public UserId?:string;
  public Title?:string;
  public Desc?:string;
  public Tags?:Array<string>;
  public Abstract?:string;
  public Content?:string;
  public IsMarkdown?:boolean;
  public IsBlog?:boolean;
  public IsTrash?:boolean;
  public IsDeleted?:boolean;
  public Usn?:number;
  public CreatedTime?:Date;
  public UpdatedTime?:Date;
  public PublicTime?:Date;
  public Files?:Array<ApiNote>;

  public static GetApiNote(note:Note,content:string,abstract:string){
    let apiNote:ApiNote=new ApiNote();
    apiNote.NoteId=note.NoteId;
    apiNote.NotebookId=note.NotebookId;
    apiNote.UserId=note.UserId;
    apiNote.Title=note.Title;
    apiNote.Desc=note.Desc;
    apiNote.Tags=note.Tags;
    apiNote.Abstract=abstract;
    apiNote.Content=content;
    apiNote.IsMarkdown=note.IsMarkdown;
    apiNote.IsBlog=note.IsBlog;
    apiNote.IsTrash=note.IsTrash;
    apiNote.IsDeleted=note.IsDeleted;
    apiNote.Usn=note.Usn;
    apiNote.CreatedTime=note.CreatedTime;
    apiNote.UpdatedTime=note.UpdatedTime;
    apiNote.PublicTime=note.PublicTime;
    
  }
}
