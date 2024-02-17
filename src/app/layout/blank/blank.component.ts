import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'layout-blank',
  template: `
    <router-outlet></router-outlet> `,
  standalone: true,
  imports: [RouterOutlet],
  host: {
    '[class.alain-blank]': 'true'
  }
})
export class LayoutBlankComponent {}
