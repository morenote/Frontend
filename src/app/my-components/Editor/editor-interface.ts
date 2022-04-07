/**
 * 编辑器抽象接口
 */
export interface EditorInterface {

  GetYourName():string;
  SetContent(value:string,clearCache :boolean):void;
  GetContent():string;
  Destroy():void;

  /**
   * 禁用（只读模式）
   * @constructor
   */
  Disabled():void;

  /**
   * 启用（编辑模式）
   * @constructor
   */
  Enable():void;

  IsReady():boolean;
}
