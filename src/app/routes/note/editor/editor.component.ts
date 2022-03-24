import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-myeditor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  repositoryId!: string;

  searchValue = '';

  //<i nz-icon nzType="folder" nzTheme="outline"></i>
  constructor(private nzContextMenuService: NzContextMenuService,
              public route: ActivatedRoute,
              private notebookService: NotebookService,
              private  noteService:NoteService) {


  }

  //{title: 'leaf', key: '1001', icon: 'folder'},
  nodes = new Array<TreeNodeModel>();

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode(node.key).then(data => {
          node.addChildren(data);
        });
      }
    }
  }

  public nzOverlayClassName: string = '';

  //节点展开事件
  loadNode(key: string): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () => {
          let array: Array<TreeNodeModel> = new Array<TreeNodeModel>();


          let a= this.notebookService.GetNotebookChildren(key).subscribe((apiRe: ApiRep) => {
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
                let b=  this.noteService.GetNotebookChildren(key).subscribe((apiRe: ApiRep) => {
                  if (apiRe.Ok == true) {
                    let data: Array<Note> = apiRe.Data;

                    for (const note of data) {
                      if (note.IsDeleted || note.IsTrash) {
                        continue;
                      }
                      let node: TreeNodeModel = new TreeNodeModel(new TreeNodeOptionsModel(note.NoteId, note.Title));
                      node.title = note.Title;
                      node.key = note.NoteId;
                      node.icon = 'file-markdown';
                      node.isLeaf=true;
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
        200
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
    this.nzContextMenuService.create(event.event!, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
}
