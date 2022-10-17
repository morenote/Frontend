import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import {Router} from "@angular/router";
import {RepositoryType} from "../../../models/enum/repository-type";

@Component({
  selector: 'header-create-repository',
  template: `
    <div
      class="alain-default__nav-item"
      nz-dropdown
      [nzDropdownMenu]="taskMenu"
      nzTrigger="click"
      nzPlacement="bottomRight"
      (nzVisibleChange)="change()"
    >
      <nz-badge >
        <i nz-icon nzType="plus" class="alain-default__nav-item-icon"></i>
      </nz-badge>
    </div>
    <nz-dropdown-menu #taskMenu="nzDropdownMenu">
      <ul nz-menu nzSelectable>
        <li nz-menu-item  (click)="createDocumentRepository()"><i nz-icon nzType="file-markdown" nzTheme="outline"></i>创建文档型仓库</li>
        <li nz-menu-item (click)="createFileRepository()"><i nz-icon nzType="hdd" nzTheme="outline"></i>创建文件型仓库</li>
        <li nz-menu-item><i nz-icon nzType="usergroup-add" nzTheme="outline"></i>创建自定义组织</li>
        <li nz-menu-item><i nz-icon nzType="import" nzTheme="outline"></i>导入第三方笔记</li>
      </ul>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCreateRepositoryComponent {
  loading = true;

  constructor(private cdr: ChangeDetectorRef,
              private router: Router) {}

  change(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 100);
  }

  createDocumentRepository() {
    // this.router.navigateByUrl("/pro/form/create-repository-form")
    let repositoryType=RepositoryType.NoteRepository;
    this.router.navigate(['/pro/form/create-repository-form'],{queryParams:{repositoryType:repositoryType}});

  }
  createFileRepository() {
    let repositoryType=RepositoryType.FileRepository;
    this.router.navigate(['/pro/form/create-repository-form'],{queryParams:{repositoryType:repositoryType}});

  }
}
