import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {NzIconModule} from "ng-zorro-antd/icon";
import {I18nPipe} from "@delon/theme";

@Component({
    selector: 'header-clear-storage',
    template: `
        <i nz-icon nzType="tool"></i>
        {{ 'menu.clear.local.storage' | i18n }}
    `,
    host: {
        '[class.flex-1]': 'true'
    },
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NzIconModule, I18nPipe]
})
export class HeaderClearStorageComponent {
  private readonly modalSrv = inject(NzModalService);
  private readonly messageSrv = inject(NzMessageService);

  @HostListener('click')
  _click(): void {
    this.modalSrv.confirm({
      nzTitle: 'Make sure clear all local storage?',
      nzOnOk: () => {
        localStorage.clear();
        this.messageSrv.success('Clear Finished!');
      }
    });
  }
}
