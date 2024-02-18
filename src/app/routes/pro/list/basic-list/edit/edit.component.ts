import { Component } from '@angular/core';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {SHARED_IMPORTS, SharedModule} from "@shared";

@Component({
  selector: 'app-basic-list-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  imports: [...SHARED_IMPORTS, SharedModule]
})
export class ProBasicListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      title: { type: 'string', title: '任务名称', maxLength: 50 },
      createdAt: { type: 'string', title: '开始时间', format: 'date' },
      owner: {
        type: 'string',
        title: '任务负责人',
        enum: [
          { value: 'asdf', label: 'asdf' },
          { value: '卡色', label: '卡色' },
          { value: 'cipchk', label: 'cipchk' }
        ]
      },
      subDescription: {
        type: 'string',
        title: '产品描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 }
        }
      }
    },
    required: ['title', 'createdAt', 'owner'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 }
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService
  ) {}

  save(value: any): void {
    this.msgSrv.success('保存成功');
    this.modal.close(value);
  }

  close(): void {
    this.modal.destroy();
  }
}
