import { AfterViewInit, Component } from '@angular/core';

import { TransferService } from './transfer.service';
import {SHARED_IMPORTS} from "@shared";
import {Step1Component} from "./step1.component";
import {Step2Component} from "./step2.component";
import {Step3Component} from "./step3.component";
import {NzStepComponent, NzStepsComponent} from "ng-zorro-antd/steps";

@Component({
  selector: 'app-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.less'],
  standalone: true,
  providers: [TransferService],
  imports: [...SHARED_IMPORTS, Step1Component, Step2Component, Step3Component, NzStepComponent, NzStepsComponent]
})
export class StepFormComponent implements AfterViewInit {
  get item(): TransferService {
    return this.srv;
  }

  constructor(private srv: TransferService) {}

  ngAfterViewInit(): void {
    console.log('item', this.item);
  }
}
