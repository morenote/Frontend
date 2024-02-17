import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { TransferService } from './transfer.service';
import {NzAlertComponent} from "ng-zorro-antd/alert";
import {SEComponent} from "@delon/abc/se";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {SHARED_IMPORTS, SharedModule} from "@shared";

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    NzAlertComponent,
    SEComponent,
    NzButtonComponent,
    SharedModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step2Component implements OnInit {
  form!: UntypedFormGroup;
  loading = false;
  get item(): TransferService {
    return this.srv;
  }

  constructor(private fb: UntypedFormBuilder, private srv: TransferService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.form.patchValue(this.item);
  }

  //#region get form fields
  get password(): AbstractControl {
    return this.form.get('password')!;
  }
  //#endregion

  _submitForm(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      ++this.item.step;
    }, 500);
  }

  prev(): void {
    --this.item.step;
  }
}
