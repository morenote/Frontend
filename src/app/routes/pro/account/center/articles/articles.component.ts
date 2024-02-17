import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'app-account-center-articles',
  templateUrl: './articles.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS,],
})
export class ProAccountCenterArticlesComponent {
  list!: any[];

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef) {
    this.http.get('/api/list', { count: 8 }).subscribe(res => {
      this.list = res;
      this.cdr.detectChanges();
    });
  }
}
