import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";

@Component({
  selector: 'app-account-settings-binding',
  templateUrl: './binding.component.html',
  standalone: true,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountSettingsBindingComponent {
  constructor(public msg: NzMessageService) {}
}
