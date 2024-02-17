import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import {_HttpClient, DatePipe} from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import {ConfigService} from "../../../../../services/config/config.service";
import {NzListComponent, NzListGridDirective, NzListItemComponent} from "ng-zorro-antd/list";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {AvatarListComponent, AvatarListItemComponent} from "@delon/abc/avatar-list";
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'app-account-center-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less'],
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    NzListItemComponent,
    NzCardComponent,
    NzCardMetaComponent,
    AvatarListComponent,
    AvatarListItemComponent,
    NzListGridDirective,
    NzListComponent,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterProjectsComponent {
  listLoading = true;
  list: any[] = [];

  constructor(private http: _HttpClient,
              private configService:ConfigService,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef) {
    var config=this.configService.GetWebSiteConfig();
    this.http.get(config.baseURL+'/api/list', { count: 8 }).subscribe(res => {
      this.list = res;
      this.listLoading = false;
      this.cdr.detectChanges();
    });
  }

  suc(id: number): void {
    this.msg.success(`标题：${id}`);
  }
}
