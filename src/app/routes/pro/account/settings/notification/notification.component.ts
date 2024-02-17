import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NzListComponent, NzListItemActionComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {SharedModule} from "@shared";

@Component({
  selector: 'app-account-settings-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzListItemActionComponent,
    NzSwitchComponent,
    SharedModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountSettingsNotificationComponent {
  i: {
    password: boolean;
    messages: boolean;
    todo: boolean;
  } = {
    password: true,
    messages: true,
    todo: true
  };
}
