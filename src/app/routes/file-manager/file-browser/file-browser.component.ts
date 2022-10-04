import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TreeNodeModel} from "../../../models/model/tree-node-model";
import {NzFormatBeforeDropEvent, NzFormatEmitEvent} from "ng-zorro-antd/tree";
import {delay, Observable, of, Subject, takeUntil} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {TreeNodeOptionsModel} from "../../../models/model/tree-node-options-model";
import {TimeFormatUtil} from "../../../shared/utils/Time/time-format-util"
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzMessageService} from "ng-zorro-antd/message";
import {VirtualFileInfo} from "../../../models/entity/File/virtual-file-info";

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.less']
})


export class FileBrowserComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable', { static: false }) nzTableComponent?: NzTableComponent<VirtualFileInfo>;
  private destroy$ = new Subject();

  listOfData: VirtualFileInfo[] = [];
  selectFile: VirtualFileInfo | undefined;
  qrValue:string='https://dev.morenote.top';

  constructor(public message:NzMessageService,
              private nzContextMenuService: NzContextMenuService,) {
  }

  nodes = new Array<TreeNodeModel>();
  searchValue = '';
  noteTitle: any;
  inputVisible: any;


  ngOnInit(): void {
    let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel('111', '111'));
    node.title = '111';
    node.key = '1111';
    node.isLeaf = true;
    this.nodes.push(node);
    for (let i = 0; i <50; i++) {
      this.listOfData.push({
        Id: '3'+i,
        Name: 'Westworld.S03E07.2020.1080p.WEB-DL.x265.10bit.AC3'+i+".mp4",
        Size: 32,
        ModifyDate: new Date()

      });
    }
    this.message.info("init");
    this.nzTableComponent?.cdkVirtualScrollViewport?.renderedRangeStream.subscribe(()=>{
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
    console.log(event);

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
