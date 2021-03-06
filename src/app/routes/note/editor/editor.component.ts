import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd/tree';
import {delay, Observable, of} from 'rxjs';
import Vditor from 'vditor';
import {ActivatedRoute, Router} from "@angular/router";
import {NotebookService} from "../../../services/NoteBook/notebook.service";
import {ApiRep} from "../../../models/api/api-rep";
import {Notebook} from "../../../models/entity/notebook";
import {TreeNodeModel} from "../../../models/model/tree-node-model";
import {TreeNodeOptionsModel} from "../../../models/model/tree-node-options-model";
import {NoteService} from "../../../services/Note/note.service";
import {Note} from "../../../models/entity/note";
import {NzMessageModule, NzMessageService} from "ng-zorro-antd/message";
import {
  VditorMarkdownEditorComponent
} from "../../../my-components/Editor/VditorMarkdomEditor/vditor-markdown-editor.component";
import {NoteContent} from "../../../models/entity/note-content";
import {TextbusEditorComponent} from "../../../my-components/Editor/TextbusEditor/textbus-editor.component";
import {NzTreeComponent} from "ng-zorro-antd/tree/tree.component";
import {EditorInterface} from "../../../my-components/Editor/editor-interface";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {InputModalComponent} from "../../../my-components/MyModal/re-name-modal-component/input-modal.component";
import {
  ISearchNoteAction,
  SerchNoteModalComponent
} from "../../../my-components/MyModal/serch-note-modal/serch-note-modal.component";
import {Watermark} from "../../../shared/utils/WaterMark/watermark";
import {ConfigService} from "../../../services/config/config.service";
import {TimeFormatUtil} from "../../../shared/utils/Time/time-format-util";
import {LogUtil} from "../../../shared/utils/log-util";

@Component({
  selector: 'app-myeditor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit, ISearchNoteAction {
  repositoryId!: string;

  searchValue = '';
  noteTitle?: string;
  isSpinning = false;

  //<i nz-icon nzType="folder" nzTheme="outline"></i>
  constructor(private nzContextMenuService: NzContextMenuService,
              public route: ActivatedRoute,
              private configService:ConfigService,
              public message: NzMessageService,
              private notebookService: NotebookService,
              private modal: NzModalService,
              private noteService: NoteService) {



  }

  /**
   * ????????????
   * @param note
   */
  openNote(note: Note): void {
        this.clickNoteId=note.NoteId;
        this.message.info(note.Title)
        let title: string = note.Title;
        this.noteTitle = title;
        this.onClieckNote(note.NoteId,note.IsMarkdown);
        LogUtil.debug("openNote???"+note.NoteId)
        LogUtil.debug("openNote???"+note.Title)
  }

  //{title: 'leaf', key: '1001', icon: 'folder'},
  nodes = new Array<TreeNodeModel>();
  selectedIndex = 0;

  rightClickNode!: TreeNodeModel;//????????????
  clickTreeNode!: TreeNodeModel;//????????????
  clickNoteId?:string;//??????????????????ID

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
  //?????????
  editor: EditorInterface | undefined;


  isMarkdown: boolean = true;


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
      this.message.info('getChildren=' + this.nzTree?.getTreeNodes().length)
      let node: TreeNodeModel = <TreeNodeModel>event.node;
      let key: string = node!.key;
      let title: string = node!.title;
      this.clickTreeNode = node;
      this.clickNoteId=node.key;
      let type = node?.isLeaf;
      this.message.success(key + '=' + title + type);
      if (type != null && type) {
        this.onClieckNote(key, node.isMarkdown);
        this.noteTitle = title;
      }
    }
  }


  protected onClieckNote(noteId: string, isMarkdown?: boolean) {
    this.noteService.GetNoteContent(noteId).subscribe((apiRe: ApiRep) => {
      if (apiRe.Ok == true) {
        let noteContent: NoteContent = apiRe.Data
        this.isMarkdown = isMarkdown!;
        this.message.info(this.isMarkdown + '?');
        if (isMarkdown) {
          //todo:vditor???ready?????????????????????
          setTimeout(() => {
            this.vditor!.SetContent(noteContent.Content!, true);
            this.editor = this.vditor;
          }, 500);
        } else {
          console.log('note is textbus')
          console.log('Content is ' + noteContent.Content?.length)
          setTimeout(() => {
            //todo:textbus???ready?????????????????????
            this.textbusEditor!.SetContent(noteContent.Content!, true);
            this.editor = this.textbusEditor;
          }, 500);

        }
        setTimeout(() => {
          this.message.info('??????????????????' + this.editor?.GetYourName())
        }, 500);
      }else {
        if (apiRe.Msg!=null){
          this.message.error(apiRe.Msg!);
        }else {
          this.message.error("GetNoteContent is error");
        }

        return;
      }
    })
  }

  public nzOverlayClassName: string = '';

  //??????????????????
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
                  let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(notebook.NotebookId, notebook.Title));
                  node.title = notebook.Title;
                  node.key = notebook.NotebookId;

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
                      let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.NoteId, note.Title));
                      node.title = note.Title;
                      node.key = note.NoteId;
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

  ngOnInit(): void {
    this.repositoryId = this.route.snapshot.queryParams["repository"];

    this.notebookService.GetRootNotebooks(this.repositoryId).subscribe((apiRe: ApiRep) => {
        if (apiRe.Ok == true) {
          let data: Array<Notebook> = apiRe.Data;
          for (const notebook of data) {
            let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(notebook.NotebookId, notebook.Title));
            node.title = notebook.Title;
            node.key = notebook.NotebookId;
            node.icon = 'folder';
            this.nodes.push(node)
          }
          //{title: 'leaf', key: '1001', icon: 'folder'},
          console.log(this.nodes)
        } else {
          this.message.error("???????????????????????????????????????????????????");
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel('1', '????????????????????????????????????'));

          node.icon = 'folder';
          this.nodes.push(node)

        }
      }
    );
    if (this.configService.openWatermark()){
      let userId=this.configService.GetUserToken().UserId;
      let userName=this.configService.GetUserToken().Username;
      let wTest=userName+" "+TimeFormatUtil.nowToString("yyyy-MM-dd");
      let watermark:Watermark=new Watermark({watermark_txt:wTest});
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
    this.message.info('??????=' + event!.node!.title);
    this.rightClickNode = <TreeNodeModel>event!.node;
    this.nzContextMenuService.create(event.event!, menu);
  }


  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  /**
   * ???????????????
   * @param $event
   */
  onCreateNotebook($event: MouseEvent, isRoot: boolean) {
    let noteRepositoryId = this.repositoryId;
    this.reNameModalComponent.clearValue();
    this.reNameModalComponent.showModal('???????????????', '????????????????????????', async (result: boolean, value: string) => {
      if (result && value) {
        let parentFolder = this.rightClickNode!.key;
        if (isRoot) {
          parentFolder = '';
        }

        let apiRe = await this.notebookService.CreateNoteBook(noteRepositoryId, value, parentFolder);
        if (apiRe.Ok == true) {
          let notebook: Notebook = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(notebook.NotebookId, notebook.Title));
          node.title = notebook.Title;
          node.key = notebook.NotebookId;
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
   * ?????? ??????
   */
  async onMenuDelete() {
    if (this.rightClickNode.isLeaf) {
      //?????????
      let apiRe = await this.noteService.deleteNote(this.repositoryId, this.rightClickNode.key);
      if (apiRe.Ok) {
        this.message.success('??????????????????');
        this.rightClickNode.remove();
      } else {
        this.message.error('?????????????????????????????????')
      }
    } else {
      //????????????
      let apiRe= await this.notebookService.deleteNotebook(this.repositoryId, this.rightClickNode.key, true, true);
      if (apiRe.Ok) {
        this.message.success('?????????????????????,?????????title=' + this.clickTreeNode.title);
        let a = this.rightClickNode.parentNode?.getChildren().filter((x) => x.key != this.rightClickNode.key);
        this.rightClickNode.parentNode?.clearChildren();
        if (a) {
          this.rightClickNode.parentNode?.getChildren().push(...a);
        }
        this.nzTree?.renderTree();
        this.message.info('????????????????????????????????????')
      } else {
        this.message.error('?????????????????????????????????')
      }
    }
  }

  /**
   * ??????markdown??????
   */
  onCreateMdDoc() {

    this.reNameModalComponent.showModal('??????markdown??????', '?????????????????????', async (result: boolean, value: string) => {
      if (result && value != null && value != '') {
        let apiRe = await this.noteService.CreateNote(value, this.rightClickNode!.key, true);
        if (apiRe.Ok == true) {
          let note: Note = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.NoteId, note.Title));
          node.icon = 'file-markdown';
          node.isLeaf = true;
          node.isMarkdown = true;
          node.parentNode = this.rightClickNode;
          let array = new Array<TreeNodeModel>();
          array.push(node)
          this.rightClickNode?.addChildren(new Array(node))
        }

      }
    });

  }

  /**
   * ?????????????????????
   */
  onCreateHtmlDoc() {
    this.reNameModalComponent.showModal('?????????????????????', '?????????????????????', async (result: boolean, value: string) => {
      if (result && value != null && value != '') {
        let apiRe = await this.noteService.CreateNote(value, this.rightClickNode!.key, false);
        if (apiRe.Ok == true) {
          let note: Note = apiRe.Data;
          let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.NoteId, note.Title));
          node.icon = 'html5';
          node.isLeaf = true;
          node.isMarkdown = false;
          node.parentNode = this.rightClickNode;
          let array = new Array<TreeNodeModel>();
          array.push(node)
          this.rightClickNode?.addChildren(array);
        }

      }

    })

  }

  saveMessageId!: string;

  //???????????????
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.code == 'KeyS') {
      if (this.clickTreeNode == null && this.clickNoteId == null) {
        event.preventDefault();
        this.message.info('??????????????????????????????')
        return;
      }
      this.saveMessageId = this.message.loading('???????????????????????????????????????????????????', {nzDuration: 0}).messageId;
      this.updateNote().then();
      event.preventDefault();
    }

    if (event.ctrlKey && event.altKey && event.code == 'KeyN') {
      event.preventDefault();
      this.message.info('??????????????????')
      this.serchNoteModalComponent.ds.key = '??????';
      this.serchNoteModalComponent.ds.noteRepositoryId = this.repositoryId;
      this.serchNoteModalComponent.showModal('????????????', '???????????????', this);
      return;

    }
  }

  /**
   * ??????????????????
   */
  async updateNote() {

    let title = this.noteTitle;
    let content = this.editor?.GetContent();
    if (content == null || content == undefined) {
      this.message.remove(this.saveMessageId);
      this.message.error('?????????????????????????????????????????????????????????');
      return;
    }
    LogUtil.debug("updateNote:"+this.clickNoteId)
    LogUtil.debug("updateNote:"+title)
    let apiRe = await this.noteService.UpdateNoteTitleAndContent(this.clickNoteId!, title!, content!);
    if (apiRe.Ok) {
      if (this.clickTreeNode!=null){
        this.clickTreeNode.title = title!;
      }
    }
    setTimeout(() => {
      if (this.saveMessageId != null) {
        this.message.remove(this.saveMessageId);
        this.message.success('????????????')
      }
    }, 1000)

  }

  confirmModal?: NzModalRef; // For testing by now
  OnReName() {
    if (this.rightClickNode == null) {
      return;
    }
    let id = this.rightClickNode.key;
    let title: string = '';
    this.reNameModalComponent.setValue(this.rightClickNode.title);
    this.reNameModalComponent.showModal('?????????', '??????????????????', (result: boolean, title: string) => {
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
    let apiRe = await this.notebookService.UpdateNoteBookTitle(noteBookId, title);
    if (apiRe.Ok) {
      this.rightClickNode.title = title;
    }
  }


  //--------------????????????------------------
  tags = ['Unremovable', 'Tag 2', 'Tag 3'];//??????
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement', {static: false}) inputElement?: ElementRef;

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
      //????????????
      this.message.info('???????????????????????????');
      this.editor?.Enable()
    } else {
      //????????????
      this.message.info('???????????????????????????');
      this.editor?.Disabled();
    }
  }
}
