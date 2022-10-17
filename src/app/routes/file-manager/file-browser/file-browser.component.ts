import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TreeNodeModel} from "../../../models/model/tree-node-model";
import {NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd/tree";
import {delay, Observable, of, Subject, takeUntil} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {TreeNodeOptionsModel} from "../../../models/model/tree-node-options-model";
import {TimeFormatUtil} from "../../../shared/utils/Time/time-format-util"
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzMessageService} from "ng-zorro-antd/message";
import {VirtualFileInfo} from "../../../models/entity/File/virtual-file-info";
import {VirtualFolderAccessService} from "../../../services/VirtualIO/virtual-folder-access.service";
import {ActivatedRoute} from "@angular/router";
import {VirtualFolderInfo} from "../../../models/entity/File/VirtualFolderInfo";
import {NzTreeComponent} from "ng-zorro-antd/tree/tree.component";
import {ApiRep} from "../../../models/api/api-rep";
import {Notebook} from "../../../models/entity/notebook";
import {Note} from "../../../models/entity/note";

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
  qrValue:string='https://dev.morenote.top';
  repositoryId:string="";



  constructor(public message:NzMessageService,
              public route: ActivatedRoute,
              private  folderService:VirtualFolderAccessService,
              private nzContextMenuService: NzContextMenuService,) {
  }

  nodes = new Array<TreeNodeModel>();
  searchValue = '';
  noteTitle: any;
  inputVisible: any;


  async ngOnInit() {
    this.repositoryId = this.route.snapshot.queryParams["repository"];

    let rootFolder = await this.folderService.GetRootVirtualFolderInfos(this.repositoryId);
    if (rootFolder != null && rootFolder.Ok) {
      let list = rootFolder.Data as Array<VirtualFolderInfo>;
      for (const item of list) {
        let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(item.Id!, item.Name!));
        node.icon = 'folder';
        node.key=item.Id!;
        this.nodes.push(node);
      }

    }
    this.message.info("init");
    this.nzTableComponent?.cdkVirtualScrollViewport?.renderedRangeStream.subscribe(() => {
      this.message.info("renderedRangeStream");
    });
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }
  trackByIndex(index: number, data: VirtualFileInfo): string {
    this.message.info("trackByIndex"+index);
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
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
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

  }
  loadNode(key: string): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () => {
          let array: Array<TreeNodeModel> = new Array<TreeNodeModel>();
          let a = this.notebookService.GetNotebookChildren(key).subscribe((apiRe: ApiRep) => {
              if (apiRe.Ok == true) {
                let data: Array<Notebook> = apiRe.Data;

                for (const notebook of data) {
                  if (notebook.IsDeleted || notebook.IsTrash) {
                    continue;
                  }
                  let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(notebook.Id, notebook.Title));
                  node.title = notebook.Title;
                  node.key = notebook.Id;

                  node.icon = 'folder';
                  array.push(node)
                }
                //{title: 'leaf', key: '1001', icon: 'folder'},
                console.log(this.nodes)
                let b = this.noteService.GetNotebookChildren(key).subscribe((apiRe: ApiRep) => {
                  if (apiRe.Ok == true) {
                    let data: Array<Note> = apiRe.Data;

                    for (const note of data) {
                      if (note.IsDeleted || note.IsTrash) {
                        continue;
                      }
                      let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.Id, note.Title));
                      node.title = note.Title;
                      node.key = note.Id;
                      node.isLeaf = true;
                      node.isMarkdown = note.IsMarkdown;
                      if (node.isMarkdown) {
                        node.icon = 'file-markdown';
                      } else {
                        //<i nz-icon nzType="html5" nzTheme="outline"></i>
                        node.icon = 'html5';
                      }

                      array.push(node)
                    }
                    //{title: 'leaf', key: '1001', icon: 'folder'},
                    console.log(this.nodes)
                    resolve(array);
                  }
                });
              }
            }
          );
        }
        ,
        10
      );
    });
  }

  contextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    console.log(event.node);
    this.message.info('右键=' + event!.node!.title);

    this.nzContextMenuService.create(event.event!, menu);

  }
  contextMenu2(event: MouseEvent, menu: NzDropdownMenuComponent): void {


    this.nzContextMenuService.create(event, menu);

  }

  OnReName() {

  }

  onMenuDelete() {

  }

  onCreateNotebook($event: MouseEvent, b: boolean) {

  }

  onCreateMdDoc() {

  }

  onCreateHtmlDoc() {

  }

  pushToBlog() {

  }

  onQueryParamsChange($event: any) {
    this.message.info("11");
  }

  index($event: any) {
    this.message.info("index");
  }

  clickTableTr(data: VirtualFileInfo) {
    this.selectFile=data;
  }

  dbClick(data: VirtualFileInfo) {
      this.message.info("双击"+data.Name);
  }

  sayHello() {
      this.message.info('hello world');
  }
}
