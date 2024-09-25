import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions} from 'ng-zorro-antd/tree';

import {delay, Observable, of} from 'rxjs';

import {ApiRep} from '../../../models/api/api-rep';
import {Note} from '../../../models/entity/note';
import {NoteContent} from '../../../models/entity/note-content';
import {NoteCollection} from '../../../models/entity/noteCollection';
import {TreeNodeModel} from '../../../models/model/tree-node-model';
import {TreeNodeOptionsModel} from '../../../models/model/tree-node-options-model';
import {TextbusEditorComponent} from '../../../my-components/Editor/TextbusEditor/textbus-editor.component';
import {
  VditorMarkdownEditorComponent
} from '../../../my-components/Editor/VditorMarkdomEditor/vditor-markdown-editor.component';
import {EditorInterface} from '../../../my-components/Editor/editor-interface';
import {InputModalComponent} from '../../../my-components/MyModal/re-name-modal-component/input-modal.component';
import {
  ISearchNoteAction,
  SerchNoteModalComponent
} from '../../../my-components/MyModal/serch-note-modal/serch-note-modal.component';
import {NoteService} from '../../../services/Note/note.service';
import {NoteCollectionService} from '../../../services/Note/note-collection.service';
import {ConfigService} from '../../../services/config/config.service';
import {TimeFormatUtil} from '../../../shared/utils/Time/time-format-util';
import {Watermark} from '../../../shared/utils/WaterMark/watermark';
import {LogUtil} from '../../../shared/utils/log-util';
import {ExtendedNameEnum} from "../../../models/enum/extended-name-enum";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzInputGroupComponent} from "ng-zorro-antd/input";
import {SHARED_IMPORTS, SharedModule} from "@shared";
import {
  SimpleMindMapComponen
} from "../../../my-components/Editor/simple-mind-map/simple-mind-map/simple-mind-map.component";
import {ExtendedName} from "../../../models/enum/extended-name";


@Component({
  selector: 'app-myeditor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'],
  imports: [
    ...SHARED_IMPORTS,
    NzTabSetComponent,
    NzTabComponent,
    NzInputGroupComponent,
    SharedModule,

    InputModalComponent,
    SerchNoteModalComponent,
    TextbusEditorComponent,
    SimpleMindMapComponen,
    VditorMarkdownEditorComponent,
    NzTreeComponent
  ],
  standalone: true
})
export class EditorComponent implements OnInit, ISearchNoteAction {
  repositoryId!: string;

  searchValue = '';
  noteTitle?: string;
  isSpinning = false;
  switchValue: boolean = false;

  //<i nz-icon nzType="folder" nzTheme="outline"></i>
  constructor(
    private nzContextMenuService: NzContextMenuService,
    public route: ActivatedRoute,
    private configService: ConfigService,
    public message: NzMessageService,
    private notebookService: NoteCollectionService,
    private modal: NzModalService,
    private noteService: NoteService
  ) {}

  /**
   * 打开笔记
   *
   * @param note
   */
  openNote(note: Note): void {
    this.clickNoteId = note.Id;
    this.message.info(note.Title);
    let title: string = note.Title;
    this.noteTitle = title;
    this.onClieckNote(note.Id, note.ExtendedName);
    LogUtil.debug(`openNote：${note.Id}`);
    LogUtil.debug(`openNote：${note.Title}`);
  }

  //{title: 'leaf', key: '1001', icon: 'folder'},
  nodes = new Array<TreeNodeModel>();
  selectedIndex = 0;

  rightClickNode!: TreeNodeModel; //右键选中
  clickTreeNode!: TreeNodeModel; //单击选中
  clickNoteId?: string; //选择的笔记的ID

  @ViewChild('vditor')
  vditor?: VditorMarkdownEditorComponent;
  @ViewChild('textbus')
  textbusEditor?: TextbusEditorComponent;
  @ViewChild('nzTree')
  nzTree?: NzTreeComponent;
  @ViewChild('reNameModalComponent')
  reNameModalComponent!: InputModalComponent;

  @ViewChild('serchNoteModalComponent')
  serchNoteModalComponent!: SerchNoteModalComponent;
  //编辑器
  editor: EditorInterface | undefined;


  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    // load child async
    if (event.eventName === 'expand') {
      let node: TreeNodeModel = <TreeNodeModel>event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode(node.key).then(data => {
          node.addChildren(data);
        });
      }
    }
    if (event.eventName === 'click') {
      this.message.info(`getChildren=${this.nzTree?.getTreeNodes().length}`);
      let node: TreeNodeModel = <TreeNodeModel>event.node;
      let key: string = node!.key;
      let title: string = node!.title;
      this.clickTreeNode = node;
      this.clickNoteId = node.key;
      let type = node?.isLeaf;
      this.message.success(`${key}=${title}${type}`);
      if (type != null && type) {
        this.onClieckNote(key, node.extendedName);
        this.noteTitle = title;
      }
    }
  }

  protected onClieckNote(noteId: string,extendedName:ExtendedNameEnum|undefined) {

    this.noteService.GetNoteContent(noteId).subscribe((apiRe: ApiRep) => {
      if (apiRe.Ok == true) {
        let noteContent: NoteContent = apiRe.Data;

        this.message.info(`${this.ExtendedNameEnum}?`);

        switch (extendedName) {
          case ExtendedNameEnum.md:
            setTimeout(() => {
              this.vditor!.SetContent(noteContent.Content!, true);
              this.editor = this.vditor;
            }, 500);
            break;
          case ExtendedNameEnum.textbus:
            console.log('note is textbus');
            console.log(`Content is ${noteContent.Content?.length}`);
            setTimeout(() => {
              //todo:textbus在ready之后才可以使用
              this.textbusEditor!.SetContent(noteContent.Content!, true);
              this.editor = this.textbusEditor;
            }, 500);
            break;
          case ExtendedNameEnum.simpleMind:
            break;
        }
        setTimeout(() => {
          this.message.info(`切换编辑器到${this.editor?.GetYourName()}`);
        }, 500);
      } else {
        if (apiRe.Msg != null) {
          this.message.error(apiRe.Msg!);
        } else {
          this.message.error('GetNoteContent is error');
        }

        return;
      }
    });
  }

  public nzOverlayClassName: string = '';

  //节点展开事件
  loadNode(key: string): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        let array: TreeNodeModel[] = new Array<TreeNodeModel>();
        let a = this.notebookService.GetNoteCollectionChildren(key).subscribe((apiRe: ApiRep) => {
          if (apiRe.Ok == true) {
            let data: NoteCollection[] = apiRe.Data;

            for (const notebook of data) {
              if (notebook.IsDeleted || notebook.IsTrash) {
                continue;
              }
              let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(notebook.Id, notebook.Title));
              node.title = notebook.Title;
              node.key = notebook.Id;

              node.icon = 'folder';
              array.push(node);
            }
            //{title: 'leaf', key: '1001', icon: 'folder'},
            console.log(this.nodes);
            let b = this.noteService.GetNotebookChildren(key).subscribe((apiRe: ApiRep) => {
              if (apiRe.Ok == true) {
                let data: Note[] = apiRe.Data;

                for (const note of data) {
                  if (note.IsDeleted || note.IsTrash) {
                    continue;
                  }
                  let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.Id, note.Title));
                  node.title = note.Title;
                  node.key = note.Id;
                  node.isLeaf = true;
                  node.extendedName = note.ExtendedName;

                  if (node.extendedName==ExtendedNameEnum.md) {
                    node.icon = 'file-markdown';
                  } else {
                    //<i nz-icon nzType="html5" nzTheme="outline"></i>
                    node.icon = 'html5';
                  }

                  array.push(node);
                }
                //{title: 'leaf', key: '1001', icon: 'folder'},
                console.log(this.nodes);
                resolve(array);
              }
            });
          }
        });
      }, 10);
    });
  }

  ngOnInit(): void {
    this.repositoryId = this.route.snapshot.queryParams['repository'];

    this.notebookService.GetRootNoteCollection(this.repositoryId).subscribe((apiRe: ApiRep) => {
      if (apiRe.Ok == true) {
        let data: NoteCollection[] = apiRe.Data;
        for (const notebook of data) {
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(notebook.Id, notebook.Title));
          node.title = notebook.Title;
          node.key = notebook.Id;
          node.icon = 'folder';
          this.nodes.push(node);
        }
        //{title: 'leaf', key: '1001', icon: 'folder'},
        console.log(this.nodes);
      } else {
        this.message.error('访问错误：您可能没有权限访问该仓库');
        let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel('1', '您可能没有权限访问该仓库'));

        node.icon = 'folder';
        this.nodes.push(node);
      }
    });
    if (this.configService.openWatermark()) {
      let userId = this.configService.GetUserToken().UserId;
      let userName = this.configService.GetUserToken().Username;
      let wTest = `${userName} ${TimeFormatUtil.nowToString('yyyy-MM-dd')}`;
      let watermark: Watermark = new Watermark({ watermark_txt: wTest });
    }
  }

  beforeDrop(arg: NzFormatBeforeDropEvent): Observable<boolean> {
    // if insert node into another node, wait 1s
    if (arg.pos === 0) {
      return of(true).pipe(delay(500));
    } else {
      return of(false);
    }
  }

  contextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    //console.log(menu.nzOverlayClassName)
    console.log(event.node);
    this.message.info(`右键=${event!.node!.title}`);
    this.rightClickNode = <TreeNodeModel>event!.node;
    this.nzContextMenuService.create(event.event!, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  /**
   * 创建文件夹
   *
   * @param $event
   */
  onCreateNoteCollection($event: MouseEvent, isRoot: boolean) {
    let noteRepositoryId = this.repositoryId;
    this.reNameModalComponent.clearValue();
    this.reNameModalComponent.showModal('创建文件夹', '请输入文件夹名称', async (result: boolean, value: string) => {
      if (result && value) {
        let parentFolder = this.rightClickNode!.key;
        if (isRoot) {
          parentFolder = '';
        }

        let apiRe = await this.notebookService.CreateNoteCollection(noteRepositoryId, value, parentFolder);
        if (apiRe.Ok == true) {
          let noteCollection: NoteCollection = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(noteCollection.Id, noteCollection.Title));
          node.title = noteCollection.Title;
          node.key = noteCollection.Id;
          node.icon = 'folder';

          if (isRoot) {
            this.nzTree?.getTreeNodes().push(node);

            this.nzTree?.renderTree();
          } else {
            node.parentNode = this.rightClickNode;
            this.rightClickNode?.addChildren(new Array(node));
          }
        }
      }
    });
  }

  /**
   * 事件 删除
   */
  async onMenuDelete() {
    if (this.rightClickNode.isLeaf) {
      //是笔记
      let apiRe = await this.noteService.deleteNote(this.repositoryId, this.rightClickNode.key);
      if (apiRe.Ok) {
        this.message.success('删除笔记成功');
        this.rightClickNode.remove();
      } else {
        this.message.error('系统拒绝了您的删除请求');
      }
    } else {
      //是笔记本
      let apiRe = await this.notebookService.deleteNoteCollection(this.repositoryId, this.rightClickNode.key, true, true);
      if (apiRe.Ok) {
        this.message.success(`删除文件夹成功,文件夹title=${this.clickTreeNode.title}`);
        let a = this.rightClickNode.parentNode?.getChildren().filter(x => x.key != this.rightClickNode.key);
        this.rightClickNode.parentNode?.clearChildren();
        if (a) {
          this.rightClickNode.parentNode?.getChildren().push(...a);
        }
        this.nzTree?.renderTree();
        this.message.info('删除根文件夹需要刷新网页');
      } else {
        this.message.error('系统拒绝了您的删除请求');
      }
    }
  }

  /**
   * 新建markdown文档
   */
  onCreateMdDoc() {
    this.reNameModalComponent.showModal('新建markdown文档', '请输入文档名称', async (result: boolean, value: string) => {
      if (result && value != null && value != '') {
        let apiRe = await this.noteService.CreateNote(value, this.rightClickNode!.key, ExtendedName.md);
        if (apiRe.Ok == true) {
          let note: Note = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.Id, note.Title));
          node.icon = 'file-markdown';
          node.isLeaf = true;
          node.extendedName = ExtendedNameEnum.md;
          node.parentNode = this.rightClickNode;
          let array = new Array<TreeNodeModel>();
          array.push(node);
          this.rightClickNode?.addChildren(new Array(node));
        }
      }
    });
  }


  /**
   * 新建富文本文档
   */
  onCreateHtmlDoc() {
    this.reNameModalComponent.showModal('新建富文本文档', '请输入文档名称', async (result: boolean, value: string) => {
      if (result && value != null && value != '') {
        let apiRe = await this.noteService.CreateNote(value, this.rightClickNode!.key, ExtendedName.textbus);
        if (apiRe.Ok == true) {
          let note: Note = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.Id, note.Title));
          node.icon = 'html5';
          node.isLeaf = true;
          node.extendedName = ExtendedNameEnum.textbus;
          node.parentNode = this.rightClickNode;
          let array = new Array<TreeNodeModel>();
          array.push(node);
          this.rightClickNode?.addChildren(array);
        }
      }
    });
  }
  onCreateSimpleMindDoc() {
    this.reNameModalComponent.showModal('新建思维导图文档', '请输入文档名称', async (result: boolean, value: string) => {
      if (result && value != null && value != '') {
        let apiRe = await this.noteService.CreateNote(value, this.rightClickNode!.key, ExtendedName.textbus);
        if (apiRe.Ok == true) {
          let note: Note = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.Id, note.Title));
          node.icon = 'html5';
          node.isLeaf = true;
          node.extendedName = ExtendedNameEnum.simpleMind;
          node.parentNode = this.rightClickNode;
          let array = new Array<TreeNodeModel>();
          array.push(node);
          this.rightClickNode?.addChildren(array);
        }
      }
    });
  }

  saveMessageId!: string;

  //快捷键按下
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.code == 'KeyS') {
      if (this.clickTreeNode == null && this.clickNoteId == null) {
        event.preventDefault();
        this.message.info('未选择笔记，无需保存');
        return;
      }
      this.saveMessageId = this.message.loading('正在努力保存笔记，请勿进行其他操作', { nzDuration: 0 }).messageId;
      this.updateNote().then();
      event.preventDefault();
    }

    if (event.ctrlKey && event.altKey && event.code == 'KeyN') {
      event.preventDefault();
      this.message.info('笔记搜索功能');
      this.serchNoteModalComponent.ds.key = '头像';
      this.serchNoteModalComponent.ds.noteRepositoryId = this.repositoryId;
      this.serchNoteModalComponent.showModal('全文检索', '搜索关键字', this);
      return;
    }
  }

  /**
   * 更新笔记内容
   */
  async updateNote() {
    let title = this.noteTitle;
    let content = this.editor?.GetContent();
    if (content == null) {
      this.message.remove(this.saveMessageId);
      this.message.error('保存内容存在错误，无法保存当前笔记内容');
      return;
    }
    LogUtil.debug(`updateNote:${this.clickNoteId}`);
    LogUtil.debug(`updateNote:${title}`);
    let apiRe = await this.noteService.UpdateNoteTitleAndContent(this.clickNoteId!, title!, content!);
    if (apiRe.Ok) {
      if (this.clickTreeNode != null) {
        this.clickTreeNode.title = title!;
      }
    }
    setTimeout(() => {
      if (this.saveMessageId != null) {
        this.message.remove(this.saveMessageId);
        this.message.success('保存成功');
      }
    }, 1000);
  }

  confirmModal?: NzModalRef; // For testing by now
  OnReName() {
    if (this.rightClickNode == null) {
      return;
    }
    let id = this.rightClickNode.key;
    let title: string = '';
    this.reNameModalComponent.setValue(this.rightClickNode.title);
    this.reNameModalComponent.showModal('重命名', '请输入重命名', (result: boolean, title: string) => {
      this.message.info('ok');
      if (result && this.reNameModalComponent.value) {
        title = this.reNameModalComponent.value!;
        if (this.rightClickNode.isLeaf) {
          this.RenameNote(id, title);
        } else {
          this.ReNameNoteBook(id, title);
        }
      }
      this.reNameModalComponent.clearValue();
    });
  }

  private RenameNote(noteId: string, title: string) {
    this.noteService.UpdateNoteTitle(noteId, title).subscribe((apiRe: ApiRep) => {
      if (apiRe.Ok) {
        this.rightClickNode.title = title;
      }
    });
  }

  private async ReNameNoteBook(noteBookId: string, title: string) {
    let apiRe = await this.notebookService.UpdateNoteCollectionTitle(noteBookId, title);
    if (apiRe.Ok) {
      this.rightClickNode.title = title;
    }
  }

  //--------------标签功能------------------
  tags = ['Unremovable', 'Tag 2', 'Tag 3']; //标签
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  onChangeEditorEditable(value: boolean) {
    if (value) {
      //编辑模式
      this.message.info('已经切换到编辑模式');
      this.editor?.Enable();
    } else {
      //只读模式
      this.message.info('已经切换到只读模式');
      this.editor?.Disabled();
    }
  }

  pushToBlog() {
    this.message.info('发布到VuePress');
  }
  BlogSwitchChange(event: any) {
    this.message.info(event);
  }

  protected readonly ExtendedNameEnum = ExtendedNameEnum;
}
