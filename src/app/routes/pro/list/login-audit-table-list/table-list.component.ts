import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';
import {LoginAuditService} from "../../../../services/LoginAudit/login-audit.service";
import {ApiRep} from "../../../../models/api/api-rep";

@Component({
  selector: 'app-login-audit-table-list',
  templateUrl: './table-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginAuditProTableListComponent implements OnInit {
  q: {
    pi: number;
    ps: number;
    no: string;
    sorter: string;
    status: number | null;
    statusList: NzSafeAny[];
  } = {
    pi: 1,
    ps: 10,
    no: '',
    sorter: '',
    status: null,
    statusList: []
  };
  data: any[] = [];
  loading = false;
  status = [
    { index: true, text: 'Success', value: false, type: 'success', checked: false },
    { index: false, text: 'Error', value: false, type: 'error', checked: false }
  ];
  @ViewChild('st', { static: true })
  st!: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'Id', type: 'checkbox' },
    { title: '登录事件编号', index: 'Id' },
    {
      title: '登录账户',
      index: 'UserId',
    },
    {
      title: '登录时间',
      index: 'LoginDateTime',
      type: 'date',
      sort: {
        compare: (a, b) => a.LoginDateTime - b.LoginDateTime
      }
    },
    { title: '登录方式', index: 'LoginMethod' },
    { title: '登录结果', index: 'IsLoginSuccess' },
    { title: 'hmac', index: 'Hmac' },
    {
      title: '校验',
      index: 'Verify',
      type: 'badge',
      badge: {
        true: { text: 'Success', color: 'success' },
        false: { text: 'Error', color: 'error' }
      },
      filter: {
        menus: this.status,
        fn: (filter, record) => record.status === filter['index']
      }
    },
    {
      title: '操作',
      buttons: [
        {
          text: '配置',
          click: item => this.msg.success(`配置${item.no}`)
        },
        {
          text: '订阅警报',
          click: item => this.msg.success(`订阅警报${item.no}`)
        }
      ]
    }
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(private http: _HttpClient,
              public msg: NzMessageService,
              private modalSrv: NzModalService,
              private cdr: ChangeDetectorRef,
              public loginAuditService:LoginAuditService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }
    this.loginAuditService.GetUserLoginLogging().subscribe((apiRe:ApiRep)=>{
      if (apiRe.Ok){
        this.data = apiRe.Data;
        this.cdr.detectChanges();
        this.loading=false;
      }else {
        if (apiRe!=null)
          this.msg.error("查阅日志失败："+apiRe.Msg!);
      }
    });
  }

  stChange(e: STChange): void {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove(): void {
    // this.http.delete('/rule', { nos: this.selectedRows.map(i => i['no']).join(',') }).subscribe(() => {
    //   this.getData();
    //   this.st.clearCheck();
    // });
    this.msg.success(`订阅警报 ${this.selectedRows.length} 笔`);
  }

  approval(): void {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  add(tpl: TemplateRef<{}>): void {

    this.msg.error('日志信息是只读的');


    // this.modalSrv.create({
    //   nzTitle: '新建规则',
    //   nzContent: tpl,
    //   nzOnOk: () => {
    //     this.loading = true;
    //     this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
    //   }
    // });
  }

  reset(): void {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
