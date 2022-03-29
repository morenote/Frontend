import {Component, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-myeditor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  repositoryId!: string;

  searchValue = '';
  noteTitle?: string;


  //<i nz-icon nzType="folder" nzTheme="outline"></i>
  constructor(private nzContextMenuService: NzContextMenuService,
              public route: ActivatedRoute,
              public message: NzMessageService,
              private notebookService: NotebookService,
              private noteService: NoteService) {
  }

  //{title: 'leaf', key: '1001', icon: 'folder'},
  nodes = new Array<TreeNodeModel>();
  tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  selectedIndex = 0;

  rightClickNode!:TreeNodeModel;//右键选中

  @ViewChild('vditor')
  vditor?:VditorMarkdownEditorComponent;
  @ViewChild('textbus')
  textbusEditor?:TextbusEditorComponent;
  @ViewChild('nzTree')
  nzTree?:NzTreeComponent;


  isMarkdown:boolean=true;

  closeTab({index}: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  newTab(): void {
    this.tabs.push('New Tab');
    this.selectedIndex = this.tabs.length;
  }


  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    // load child async

    if (event.eventName === 'expand') {
      let node:TreeNodeModel =<TreeNodeModel> event.node ;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode(node.key).then(data => {
          node.addChildren(data);
        });
      }
    }
    if (event.eventName === 'click') {
      this.message.info('getChildren='+this.nzTree?.getTreeNodes().length)
      let node:TreeNodeModel = <TreeNodeModel>event.node ;
      let key: string = node!.key;
      let title: string = node!.title;
      let type=node?.isLeaf;
      this.message.success(key+'='+title+type);
      if (type!=null && type){
        this.onClieckNote(key,node.isMarkdown);
        this.noteTitle=title;
      }
    }
  }

  private  onClieckNote(noteId:string,isMarkdown?:boolean){
    this.noteService.GetNoteContent(noteId).subscribe((apiRe:ApiRep)=>{
      if (apiRe.Ok==true){
        let noteContent:NoteContent=apiRe.Data
        this.isMarkdown=isMarkdown!;
        this.message.info(this.isMarkdown+'?');
        if (isMarkdown){
          this.vditor?.SetValue(noteContent.Content!);
        }else {
          console.log('note is textbus')
          console.log('Content is '+noteContent.Content?.length)
          setTimeout(()=>{
            //todo:textbus在ready之后才可以使用
            this.textbusEditor!.SetValue(noteContent.Content!);
          },100);
        }
      }
    })
  }
  public nzOverlayClassName: string = '';
  //节点展开事件
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
                      node.isMarkdown=note.IsMarkdown;
                      if (node.isMarkdown){
                        node.icon = 'file-markdown';
                      }else {
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
        }else {
          this.message.error("访问错误：您可能没有权限访问该仓库");
        }
      }
    );
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
    this.message.info('右键='+event!.node!.title);
    this.rightClickNode=<TreeNodeModel>event!.node;
    this.nzContextMenuService.create(event.event!, menu);
  }


  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  onCreateNotebook($event: MouseEvent) {
    this.notebookService.CreateNoteBook('test',this.rightClickNode!.key).subscribe((apiRe:ApiRep)=>{
      if (apiRe.Ok==true){
        let notebook:Notebook=apiRe.Data;
        let node:TreeNodeModel=new TreeNodeModel(new TreeNodeOptionsModel(notebook.NotebookId, notebook.Title));
        node.title = notebook.Title;
        node.key = notebook.NotebookId;
        node.icon = 'folder';
        node.parentNode=this.rightClickNode;
        let array=new Array<TreeNodeModel>();
        array.push(node)
        this.rightClickNode?.addChildren(array);
      }
    })
  }

  onMenuDelete() {
    if (this.rightClickNode.isLeaf){
      //是笔记
    }else {
      //是笔记本

    }
  }

  /**
   * 新建markdown文档
   */
  onCreateMdDoc() {
    this.noteService.CreateNote('test',this.rightClickNode!.key,true).subscribe((apiRe:ApiRep)=>{
      if (apiRe.Ok==true){
        let note:Note=apiRe.Data;
        let node:TreeNodeModel=new TreeNodeModel(new TreeNodeOptionsModel(note.NoteId, note.Title));
        node.icon = 'file-markdown';
        node.isLeaf=true;
        node.isMarkdown=true;
        node.parentNode=this.rightClickNode;
        let array=new Array<TreeNodeModel>();
        array.push(node)
        this.rightClickNode?.addChildren(array);
      }
    });
  }

  /**
   * 新建富文本文档
   */
  onCreateHtmlDoc() {
    this.noteService.CreateNote('test',this.rightClickNode!.key,false).subscribe((apiRe:ApiRep)=>{
      if (apiRe.Ok==true){
        let note:Note=apiRe.Data;
        let node:TreeNodeModel=new TreeNodeModel(new TreeNodeOptionsModel(note.NoteId, note.Title));
        node.icon = 'html5';
        node.isLeaf=true;
        node.isMarkdown=true;
        node.parentNode=this.rightClickNode;
        let array=new Array<TreeNodeModel>();
        array.push(node)
        this.rightClickNode?.addChildren(array);
      }
    });
  }
}
