import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TransferService } from './transfer.service';
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[...SHARED_IMPORTS]
})
export class Step2Component implements OnInit {
  form = new FormGroup({
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
  });
  loading = false;
  get item(): TransferService {
    return this.srv;
  }

  constructor(private srv: TransferService) {}

  ngOnInit(): void {
    this.form.patchValue(this.item);
  }

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
