import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MyDataSource} from "../../../services/Search/NoteSearch/my-data-source";
import { HttpClient } from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd/message";
import {Note} from "../../../models/entity/note";
import {NzModalComponent} from "ng-zorro-antd/modal";
import {NzInputGroupComponent} from "ng-zorro-antd/input";
import {CdkFixedSizeVirtualScroll} from "@angular/cdk/scrolling";
import {
  NzListComponent, NzListItemActionComponent,
  NzListItemComponent,
  NzListItemMetaAvatarComponent,
  NzListItemMetaTitleComponent
} from "ng-zorro-antd/list";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {SharedModule} from "@shared";

export interface ISearchNoteAction {
  openNote(note:Note):void;
}

@Component({
  selector: 'app-serch-note-modal',
  templateUrl: './serch-note-modal.component.html',
  standalone: true,
  imports: [
    NzModalComponent,
    NzInputGroupComponent,
    CdkFixedSizeVirtualScroll,
    NzListComponent,
    NzListItemComponent,
    NzSkeletonComponent,
    NzListItemMetaAvatarComponent,
    NzListItemMetaTitleComponent,
    NzListItemActionComponent,
    NzDropDownDirective,
    NzDropdownMenuComponent,
    SharedModule
  ],

  styleUrls: ['./serch-note-modal.component.less']
})
export class SerchNoteModalComponent implements OnInit {

  public ds: MyDataSource;

  private destroy$ = new Subject();

  @ViewChild('nzModalComponent')
  nzModalComponent!:NzModalComponent

  isVisible = false;
  isOkLoading = false;
  public result?: boolean;
  public value?: string;


  public key!: string;
  public noteRepositoryId!: string;

  title: string = '';
  placeholder: string = '';

  constructor(private http: HttpClient,
              public nzMessage: NzMessageService,
              public myDataSource: MyDataSource) {
    this.ds = myDataSource;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  func!: ISearchNoteAction;


  public showModal(title: string, placeholder: string, func: ISearchNoteAction): void {
    this.title = title;
    this.placeholder = placeholder;
    this.isVisible = true;
    this.func = func;
  }

  public clearValue() {
    this.value = '';
  }

  public setValue(value: string) {
    this.value = value;
  }

  handleOk(): void {

    this.isVisible = false;
    this.isOkLoading = false;
  }

  handleCancel(): void {

    this.isVisible = false;
    this.result = false;
  }

  onKeyup(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      //按下回车
      let key = this.value;
      if (key) {
        console.log('按下回车')
        this.ds.key = key;
        this.ds.update(0);
        this.ds
          .completed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.nzMessage.warning('Infinite List loaded all');
          });
      }
    }
  }

  OnCopyId(item: Note) {
    this.copyMessage(item.Id)
    this.nzMessage.success('已经复制文档id到剪贴板')
  }

  OnInsertId(item: Note) {

  }

  OnPreviewDocument(item: Note) {

  }

  OnOpenDocument(item: any) {
    let note=item as Note;
    if (note==null){
        throw   new Error("note==null!!!");
    }
    this.func.openNote(note);
    this.nzModalComponent.close(false);
  }
  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
