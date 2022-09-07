export class Notebook {
  public Id!:string;
  public UserId!:string;
  public NotesRepositoryId!:string;
  public ParentNotebookId!:string;
  public Seq!:number;
  public Title!:string;
  public UrlTitle!:string;
  public NumberNotes!:number;
  public IsTrash!:boolean;
  public IsBlog!:boolean;
  public CreatedTime!:Date;
  public UpdatedTime!:Date;
  public IsWX!:boolean;
  public Usn!:number;
  public IsDeleted!:boolean;
  public RootParentNotebookId:string | undefined;
  public Subs:Array<Notebook> | undefined;



}
