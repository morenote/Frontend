declare class MindMap {
  constructor(opt:any);
  handleOpt(opt:any):void;
  render(callback:any, source:string):void;
  reRender(callback:any, source:string):void;
  resize():void;
  on(event:any, fn:any):void;
  setFullData(data:any):void;
  getData(withConfig:any):any;
}
