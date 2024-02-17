import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {ConfigService} from "../../../../../services/config/config.service";
import {RepositoryService} from "../../../../../services/repository/repository.service";
import {Repository} from "../../../../../models/entity/repository";
import {RepositoryType} from "../../../../../models/enum/repository-type";
import {ApiRep} from "../../../../../models/api/api-rep";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzListComponent, NzListGridDirective, NzListItemComponent} from "ng-zorro-antd/list";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-account-center-documents',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less'],
  standalone: true,
  imports: [
    NzAvatarComponent,
    NzCardMetaComponent,
    NzDropdownMenuComponent,
    NzListGridDirective,
    NzListComponent,
    NzListItemComponent,
    NzCardComponent,
    NzDropDownDirective,
    DecimalPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterFilesComponent {
  listLoading = true;

  public list: Array<Repository> = [];
  constructor(private http: _HttpClient,
              private configService:ConfigService,
              public router:Router,
              public repositoryService: RepositoryService,
              private cdr: ChangeDetectorRef,
              private message:NzMessageService) {
    var config=configService.GetWebSiteConfig();
    repositoryService.GetMyRepository(RepositoryType.FileRepository).subscribe(
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
  OnCardClick(repository: Repository) {
    //alert(repository.Name);
    this.router.navigate(['/file/browser'],{queryParams:{repository:repository.Id}})
  }
  async OnDelete(id: string) {
    let apiRe = await this.repositoryService.DeleteRepository(id);
    if (apiRe.Ok == true) {
      //alert(apiRe.Ok)
      this.list=this.list.filter(item => item.Id != id);
      this.message.success('删除仓库成功，您可以在回收站恢复被删除的仓库');
    }else {
      this.message.error('删除仓库失败');
    }
  }
}
