import {NzTreeNodeOptions} from "ng-zorro-antd/core/tree/nz-tree-base-node";
import {NzSafeAny} from "ng-zorro-antd/core/types";

export class TreeNodeOptionsModel implements NzTreeNodeOptions{
  [key: string]: NzSafeAny;

  public key!: string ;
  public title!: string;
  public  icon:string;
  constructor(key:string,title:string) {
    this.key=key;
    this.title=title;
    this.icon='folder';
  }
}
