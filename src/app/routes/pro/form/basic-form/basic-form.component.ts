import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {PageHeaderComponent} from "@delon/abc/page-header";
import {NzCardComponent} from "ng-zorro-antd/card";
import {SharedModule} from "@shared";

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardComponent,
    SharedModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicFormComponent implements OnInit {
  form!: UntypedFormGroup;
  submitting = false;

  constructor(private fb: UntypedFormBuilder, private msg: NzMessageService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      date: [null, [Validators.required]],
      goal: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      client: [null, []],
      invites: [null, []],
      weight: [null, []],
      public: [1, [Validators.min(1), Validators.max(3)]],
      publicUsers: [null, []]
    });
  }

  submit(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.msg.success(`提交成功`);
      this.cdr.detectChanges();
    }, 1000);
  }
}
