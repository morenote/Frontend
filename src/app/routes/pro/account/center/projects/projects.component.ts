import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import {ConfigService} from "../../../../../services/config/config.service";

@Component({
  selector: 'app-account-center-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less'],
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
