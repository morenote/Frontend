import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import {NotesRepositoryService} from "../../../../../services/NotesRepository/notes-repository.service";
import {ApiRep} from "../../../../../models/api/api-rep";
import {NotesRepository} from "../../../../../models/entity/notes-repository";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-account-center-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterDocumentsComponent {
  listLoading = true;
  public list: Array<NotesRepository> = [];

  constructor(private http: _HttpClient,
              private cdr: ChangeDetectorRef,
              public router:Router,
              public notesRepositoryService: NotesRepositoryService,
              private message:NzMessageService) {
    notesRepositoryService.GetMyNoteRepository().subscribe(
      (apiRe: ApiRep) => {
        console.log(apiRe.Ok)
        if (apiRe.Ok) {
          let notesRepositoryList: Array<NotesRepository> = apiRe.Data as Array<NotesRepository>;
          console.log(notesRepositoryList.length)
          for (const notesRepository of notesRepositoryList) {
            console.log(notesRepository.Name)
            this.list.push(notesRepository);
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

  OnCardClick(repository: NotesRepository) {
    //alert(repository.Name);
    this.router.navigate(['/note/editor'],{queryParams:{repository:repository.Id}})
  }

  async OnDelete(noteRepositoryId: string) {
    let apiRe = await this.notesRepositoryService.DeleteNoteRepository(noteRepositoryId);
    if (apiRe.Ok == true) {
      //alert(apiRe.Ok)
      this.list=this.list.filter(item => item.Id != noteRepositoryId);
      this.message.success('删除仓库成功，您可以在回收站恢复被删除的仓库');
    }
  }
}
