import { Component, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { delay, Observable, of } from 'rxjs';
import Vditor from 'vditor';

@Component({
  selector: 'app-myeditor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  searchValue = '';
  //<i nz-icon nzType="folder" nzTheme="outline"></i>
  constructor(private nzContextMenuService: NzContextMenuService) {}
  nodes = [
    { title: 'leaf', key: '1001', icon: 'folder' },
    { title: 'Expand to load', icon: 'folder', key: '0' },
    { title: 'Expand to load', icon: 'folder', key: '1' },
    { title: 'Tree Node', icon: 'folder', key: '2' }
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
  public nzOverlayClassName: string = '';
  //节点展开事件
  loadNode(): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve([
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-0` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-2` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-3` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-4` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-5` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-6` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-7` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-8` },

            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-9` },
            { title: 'Child Node', icon: 'folder', key: `${new Date().getTime()}-10` }
          ]),
        100
      );
    });
  }

  ngOnInit(): void {}
  beforeDrop(arg: NzFormatBeforeDropEvent): Observable<boolean> {
    // if insert node into another node, wait 1s
    if (arg.pos === 0) {
      return of(true).pipe(delay(1000));
    } else {
      return of(false);
    }
  }
  contextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    //console.log(menu.nzOverlayClassName)
    console.log(event.node);

    this.nzContextMenuService.create(event.event!, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
}
