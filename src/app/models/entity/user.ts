export class User {
  public UserId?:string;
  public Email?:string;
  public Verified?:string;
  public Username?:string;
  public UsernameRaw?:string;
  public Role?:string;
  public CreatedTime?:Date;
  public Logo?:string;
  public Theme?:string;
  public NotebookWidth?:number;
  public NoteListWidth?:number;
  public MdEditorWidth?:number;
  public LeftIsMin?:boolean;
  public ThirdUserId?:string;
  public ThirdUsername?:string;
  public ThirdType?:number;
  public ImageNum?:number;
  public ImageSize?:number;
  public AttachNum?:number;
  public FromUserId?:string;
  public AccountType?:number;
  public AccountStartTime?:Date;
  public AccountEndTime?:Date;

  //账户配额
  public MaxImageNum?:number;
  public MaxImageSize?:number;
  public MaxAttachNum?:number;
  public MaxAttachSize?:number;
  public MaxPerAttachSize?:number;
  //更新相关
  public Usn?:number;
  public FullSyncBefore?:Date;
  public BlogUrl?:string;
  public PostUrl?:string

  //编辑器偏好(保留以后使用)
  public MarkdownEditorOption?:string;
  public RichTextEditorOption?:string;

  //安全相关
  public  PasswordHashAlgorithm?:string;//用户使用的哈希算法
  public Verify?:boolean;//业务系统防止篡改
  public  Hmac?:string;//业务系统防止篡改
  //******************************联系信息*******************************************//
  public Profile?:string; //个人简介
  public Country?:string; //国家
  public Address?:string; //地址
  public Phone?:string; //地址
  public Avatar?:string; //头像
  public GeographicProvince?:string; //地理位置
  public GeographicCity?:string; //地理位置
  public Signature?:string; //个人名片签名
  public Title?:string; //个人名片标题
  public Group?:string; //个人名片归属团体
  public Tags?:string; //个人名片标签


}
