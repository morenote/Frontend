import { Component, OnInit } from '@angular/core';
import {NzFormatEmitEvent, NzTreeNodeOptions} from "ng-zorro-antd/tree";
import Vditor from "vditor";
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-myeditor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'
  ]
})


export class EditorComponent implements OnInit {
  searchValue = '';
  //<i nz-icon nzType="folder" nzTheme="outline"></i>
  constructor() { }
  nodes = [
    { title: 'leaf', key: '1001', icon: 'folder' },
    { title: 'Expand to load',icon:'folder', key: '0' },
    { title: 'Expand to load',icon: 'folder', key: '1' },
    { title: 'Tree Node',icon: 'folder', key: '2' }
  ];
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode().then(data => {
          node.addChildren(data);
        });
      }
    }
  }

  //节点展开事件
  loadNode(): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve([
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-0` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-2` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-3` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-4` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-5` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-6` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-7` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-8` },

            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-9` },
            { title: 'Child Node',icon: 'folder', key: `${new Date().getTime()}-10` }
          ]),
        100
      );
    });
  }


  ngOnInit(): void {

  }

}
