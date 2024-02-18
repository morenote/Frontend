import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SHARED_IMPORTS} from "@shared";
import {EllipsisComponent} from "@delon/abc/ellipsis";

@Component({
  selector: 'app-list-card-list',
  templateUrl: './card-list.component.html',
  styles: [
    `
      :host ::ng-deep .ant-card-meta-title {
        margin-bottom: 12px;
      }
    `
  ],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, EllipsisComponent]
})
export class ProCardListComponent implements OnInit {
  list: Array<{ id: number; title: string; avatar: string; description: string } | null> = [null];

  loading = true;

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get('/api/list', { count: 8 }).subscribe(res => {
      this.list = this.list.concat(res);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  show(text: string): void {
    this.msg.success(text);
  }
}
