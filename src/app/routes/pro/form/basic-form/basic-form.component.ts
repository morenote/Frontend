import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[...SHARED_IMPORTS]
})
export class BasicFormComponent {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    goal: new FormControl('', Validators.required),
    standard: new FormControl('', Validators.required),
    client: new FormControl(''),
    invites: new FormControl(''),
    weight: new FormControl(''),
    public: new FormControl(1, [Validators.min(1), Validators.max(3)]),
    publicUsers: new FormControl('')
  });
  submitting = false;

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  submit(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.msg.success(`提交成功`);
      this.cdr.detectChanges();
    }, 1000);
  }
}
