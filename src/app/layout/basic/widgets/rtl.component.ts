import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { RTLService } from '@delon/theme';
import {NzIconModule} from "ng-zorro-antd/icon";
import {UpperCasePipe} from "@angular/common";

@Component({
    selector: 'header-rtl',
    template: `
        <i nz-icon [nzType]="rtl.nextDir === 'rtl' ? 'border-left' : 'border-right'"></i>
        {{ rtl.nextDir | uppercase }}
    `,
    host: {
        '[class.flex-1]': 'true'
    },
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, UpperCasePipe]
})
export class HeaderRTLComponent {
  constructor(public rtl: RTLService) {}

  @HostListener('click')
  toggleDirection(): void {
    this.rtl.toggle();
  }
}
