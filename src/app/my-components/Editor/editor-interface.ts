/**
 * 编辑器抽象接口
 */
export interface EditorInterface {
  SetContent(value:string,clearCache :boolean):void;
  GetContent():string;
  Destroy():void;
}
