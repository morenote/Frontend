import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRepositoryFormComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  selectedOwner = null;
  selectedLicense = null;
  selectedRepositoryTemplate = null;
  value?: string;
  checked = true;
  constructor(private fb: FormBuilder, private msg: NzMessageService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      owner: [null, [Validators.required]],
      path: [null, [Validators.required]],
      goal: [null, []],

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

  //-----------------------
  inputValue: string = '';
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
  repositoryName: any;
  repositoryPath: any;

  onChange(value: string): void {
    console.log(value);
  }

  onSelect(suggestion: string): void {
    console.log(`onSelect ${suggestion}`);
  }

  OnRepositoryNameChange() {
    this.repositoryPath=this.repositoryName;
  }
}
