import {NzTreeNode} from "ng-zorro-antd/tree";

export class TreeNodeModel extends NzTreeNode {
  //{title: 'leaf', key: '1001', icon: 'folder'},
  public isMarkdown: boolean | undefined;
}
