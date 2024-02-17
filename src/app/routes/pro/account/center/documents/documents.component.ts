import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import {RepositoryService} from "../../../../../services/repository/repository.service";
import {ApiRep} from "../../../../../models/api/api-rep";
import {Repository} from "../../../../../models/entity/repository";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {RepositoryType} from "../../../../../models/enum/repository-type";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {DecimalPipe} from "@angular/common";

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
    NzCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterDocumentsComponent {
  listLoading = true;
  public list: Array<Repository> = [];

  constructor(private http: _HttpClient,
              private cdr: ChangeDetectorRef,
              public router:Router,
              public repositoryService: RepositoryService,
              private message:NzMessageService) {
    repositoryService.GetMyRepository(RepositoryType.NoteRepository).subscribe(
      (apiRe: ApiRep) => {
        console.log(apiRe.Ok)
        if (apiRe.Ok) {
          let notesRepositoryList: Array<Repository> = apiRe.Data as Array<Repository>;
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

  OnCardClick(repository: Repository) {
    //alert(repository.Name);
    this.router.navigate(['/note/editor'],{queryParams:{repository:repository.Id}})
  }

  async OnDelete(noteRepositoryId: string) {
    let apiRe = await this.repositoryService.DeleteRepository(noteRepositoryId);
    if (apiRe.Ok == true) {
      //alert(apiRe.Ok)
      this.list=this.list.filter(item => item.Id != noteRepositoryId);
      this.message.success('删除仓库成功，您可以在回收站恢复被删除的仓库');
    }
  }
}
