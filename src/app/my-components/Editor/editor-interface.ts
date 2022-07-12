/**
 * 编辑器抽象接口
 */
export interface EditorInterface {
  /**
   * 获得编辑器实现名称
   * @constructor
   */
  GetYourName():string;

  /**
   * 设置内容
   * @param value
   * @param clearCache
   * @constructor
   */
  SetContent(value:string,clearCache :boolean):void;

  /**
   * 获得内容
   * @constructor
   */
  GetContent():string;

  /**
   * 销毁编辑器
   * @constructor
   */
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

  /**
   * 判断编辑器是否就绪
   * @constructor
   */
  IsReady():boolean;
}
