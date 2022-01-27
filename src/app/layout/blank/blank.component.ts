import { Component } from '@angular/core';
import { SettingsService, User } from '@delon/theme';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
import { environment } from '@env/environment';

@Component({
  selector: 'layout-blank',
  template: ``,
  host: {
    '[class.alain-blank]': 'true'
  }
})
export class LayoutBlankComponent {
  isCollapsed = false;
}
