import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeComponent } from 'ng-zorro-antd/tree/tree.component';
import { delay, Observable, of, Subject, takeUntil } from 'rxjs';
import { NoteService } from 'src/app/services/Note/note.service';
import { NotebookService } from 'src/app/services/NoteBook/notebook.service';

import { ApiRep } from '../../../models/api/api-rep';
import { VirtualFolderInfo } from '../../../models/entity/File/VirtualFolderInfo';
import { VirtualFileInfo } from '../../../models/entity/File/virtual-file-info';
import { Note } from '../../../models/entity/note';
import { Notebook } from '../../../models/entity/notebook';
import { TreeNodeModel } from '../../../models/model/tree-node-model';
import { TreeNodeOptionsModel } from '../../../models/model/tree-node-options-model';
import { VirtualFolderAccessService } from '../../../services/VirtualIO/virtual-folder-access.service';
import { TimeFormatUtil } from '../../../shared/utils/Time/time-format-util';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.less']
})
export class FileBrowserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('virtualTable', { static: false }) nzTableComponent?: NzTableComponent<VirtualFileInfo>;
  private destroy$ = new Subject();

  @ViewChild('nzTree')
  nzTree?: NzTreeComponent;

  listOfData: VirtualFileInfo[] = [];
  selectFile: VirtualFileInfo | undefined;
  qrValue: string = 'https://app.morenote.top';
  repositoryId: string = '';
  constructor(
    public message: NzMessageService,
    public noteService: NoteService,
    public route: ActivatedRoute,
    public notebookService: NotebookService,
    private folderService: VirtualFolderAccessService,
    private nzContextMenuService: NzContextMenuService
  ) {}

  nodes = new Array<TreeNodeModel>();
  searchValue = '';
  noteTitle: any;
  inputVisible: any;

  async ngOnInit() {
    this.repositoryId = this.route.snapshot.queryParams['repository'];

    let rootFolder = await this.folderService.GetRootVirtualFolderInfos(this.repositoryId);
    if (rootFolder != null && rootFolder.Ok) {
      let list = rootFolder.Data as VirtualFolderInfo[];
      for (const item of list) {
        let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(item.Id!, item.Name!));
        node.icon = 'folder';
        node.key = item.Id!;
        this.nodes.push(node);
      }
    }
    this.nzTableComponent?.cdkVirtualScrollViewport?.renderedRangeStream.subscribe(() => {
      this.message.info('renderedRangeStream');
    });
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }
  trackByIndex(index: number, data: VirtualFileInfo): string {
    this.message.info(`trackByIndex${index}`);
    return data.Id!;
  }

  beforeDrop(arg: NzFormatBeforeDropEvent): Observable<boolean> {
    // if insert node into another node, wait 1s
    if (arg.pos === 0) {
      return of(true).pipe(delay(500));
    } else {
      return of(false);
    }
  }
  ngAfterViewInit(): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange.pipe(takeUntil(this.destroy$)).subscribe((data: number) => {
      console.log('scroll index to', data);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  nzEvent(event: NzFormatEmitEvent): void {
    if (event.eventName === 'expand') {
      let node: TreeNodeModel = <TreeNodeModel>event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode(node.key).then(data => {
          node.addChildren(data);
        });
      }
    }
    if (event.eventName === 'click') {
      this.message.info('hello');
      var file = new VirtualFileInfo();
      file.Id = 'hello';
      file.ModifyDate = new Date();
      file.Name = '111';
      this.listOfData.push(file);
    }
  }
  loadNode(key: string): Promise<NzTreeNodeOptions[]> {
    return new Promise(async resolve => {
      let a = await this.folderService.GetFolders(this.repositoryId, key);
      let array: TreeNodeModel[] = new Array<TreeNodeModel>();
      if (a.Ok) {
        let data = a.Data as VirtualFolderInfo[];
        data.forEach(element => {
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(element.Id!, element.Name!));
          node.icon = 'folder';
          array.push(node);
        });
      }
      resolve(array);
    });
  }

  contextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    console.log(event.node);
    this.message.info(`右键=${event!.node!.title}`);

    this.nzContextMenuService.create(event.event!, menu);
  }
  contextMenu2(event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create(event, menu);
  }

  OnReName() {}

  onMenuDelete() {}

  onCreateNotebook($event: MouseEvent, b: boolean) {}

  onCreateMdDoc() {}

  onCreateHtmlDoc() {}

  pushToBlog() {}

  onQueryParamsChange($event: any) {
    this.message.info('11');
  }

  index($event: any) {
    this.message.info('index');
  }

  clickTableTr(data: VirtualFileInfo) {
    this.selectFile = data;
  }

  dbClick(data: VirtualFileInfo) {
    this.message.info(`双击${data.Name}`);
  }

  sayHello() {
    this.message.info('hello world');
  }
}
