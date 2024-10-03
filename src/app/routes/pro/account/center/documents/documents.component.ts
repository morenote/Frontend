import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import {NotebookService} from "../../../../../services/Note/notebook.service";
import {ApiRep} from "../../../../../models/api/api-rep";
import {Notebook} from "../../../../../models/entity/notebook";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {NotebookType} from "../../../../../models/enum/notebook-type";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {DecimalPipe} from "@angular/common";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";

@Component({
  selector: 'app-account-center-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.less'],
  standalone: true,
  imports: [
    NzCardMetaComponent,
    NzAvatarComponent,
    NzDropdownMenuComponent,
    NzListItemComponent,
    NzListComponent,
    NzDropDownDirective,
    DecimalPipe,
    NzCardComponent,
    NzTooltipDirective,
    NzIconDirective,
    NzMenuDirective,
    NzMenuItemComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterDocumentsComponent {
  listLoading = true;
  public list: Array<Notebook> = [];

  constructor(private http: _HttpClient,
              private cdr: ChangeDetectorRef,
              public router:Router,
              public notebookService: NotebookService,
              private message:NzMessageService) {
    notebookService.GetMyNotebook(NotebookType.NoteRepository).subscribe(
      (apiRe: ApiRep) => {
        console.log(apiRe.Ok)
        if (apiRe.Ok) {
          let notebooks: Array<Notebook> = apiRe.Data as Array<Notebook>;
          console.log(notebooks.length)
          for (const notebook of notebooks) {
            console.log(notebook.Name)
            this.list.push(notebook);
          }
          this.listLoading = false;
          this.cdr.detectChanges();
        }
      }
    )

    // this.http.get('/api/list', { count: 8 }).subscribe((res: NzSafeAny[]) => {
    //   this.list = res.map(item => {
    //     item.activeUser = this.formatWan(item.activeUser);
    //     return item;
    //   });
    //   this.listLoading = false;
    //   this.cdr.detectChanges();
    // });
  }

  private formatWan(val: number): string {
    const v = val * 1;
    if (!v || isNaN(v)) {
      return '';
    }

    let result: string | number = val;
    if (val > 10000) {
      result = Math.floor(val / 10000);
      result = `${result}`;
    }
    return result.toString();
  }

  OnCardClick(notebook: Notebook) {
    //alert(repository.Name);
    this.router.navigate(['/note/editor'],{queryParams:{repository:notebook.Id}})
  }

  async OnDelete(notebookId: string) {
    let apiRe = await this.notebookService.DeleteNotebook(notebookId);
    if (apiRe.Ok == true) {
      //alert(apiRe.Ok)
      this.list=this.list.filter(item => item.Id != notebookId);
      this.message.success('删除笔记本成功，您可以在回收站恢复被删除的仓库');
      setTimeout(()=>{
        window.location.reload() ;
      },1500);
    }
  }
}
