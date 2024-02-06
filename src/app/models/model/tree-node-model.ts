import {NzTreeNode} from "ng-zorro-antd/tree";
import {ExtendedNameEnum} from "../enum/extended-name-enum";

export class TreeNodeModel extends NzTreeNode {
  //{title: 'leaf', key: '1001', icon: 'folder'},
  // public isMarkdown?: boolean;
  public extendedName?:ExtendedNameEnum | undefined;
}
