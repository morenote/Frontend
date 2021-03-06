import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {ConfigService} from "../../../../../services/config/config.service";

@Component({
  selector: 'app-account-center-documents',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterFilesComponent {
  listLoading = true;
  list: any[] = [];
  constructor(private http: _HttpClient,
              private configService:ConfigService,
              private cdr: ChangeDetectorRef) {
    var config=configService.GetWebSiteConfig();
    this.http.get(config.baseURL+'/api/list', { count: 8 }).subscribe((res: NzSafeAny[]) => {
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
