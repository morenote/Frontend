import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {NotesRepositoryService} from "../../../../../services/NotesRepository/notes-repository.service";
import {ApiRe} from "../../../../../models/api/api-re";

@Component({
  selector: 'app-account-center-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterDocumentsComponent {
  listLoading = true;
  list: any[] = [];
  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef,public  notesRepositoryService:NotesRepositoryService) {
    notesRepositoryService.GetMyNoteRepository().subscribe(
      (apiRe:ApiRe)=>{
        console.log(apiRe.Ok)
      }
    )
    this.http.get('/api/list', { count: 8 }).subscribe((res: NzSafeAny[]) => {
      this.list = res.map(item => {
        item.activeUser = this.formatWan(item.activeUser);
        return item;
      });
      this.listLoading = false;
      this.cdr.detectChanges();
    });
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
}
