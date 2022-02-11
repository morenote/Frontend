import { Component } from '@angular/core';

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
