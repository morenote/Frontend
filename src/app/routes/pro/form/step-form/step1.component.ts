import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TransferService } from './transfer.service';
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[...SHARED_IMPORTS]
})
export class Step1Component implements OnInit {
  form = new FormGroup({
    pay_account: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    receiver_type: new FormControl('', Validators.required),
    receiver_account: new FormControl('', Validators.required),
    receiver_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
    amount: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])
    )
  });

  get item(): TransferService {
    return this.srv;
  }

  constructor(private srv: TransferService) {}

  ngOnInit(): void {
    this.form.patchValue(this.item as any);
  }

  _submitForm(): void {
    Object.assign(this.item, this.form.value);
    ++this.item.step;
  }
}
