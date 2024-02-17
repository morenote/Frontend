import { AfterViewInit, Component } from '@angular/core';

import { TransferService } from './transfer.service';
import {Step1Component} from "./step1.component";
import {NzStepComponent, NzStepsComponent} from "ng-zorro-antd/steps";
import {PageHeaderComponent} from "@delon/abc/page-header";
import {NzCardComponent} from "ng-zorro-antd/card";
import {Step2Component} from "./step2.component";
import {Step3Component} from "./step3.component";
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'app-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.less'],
  standalone: true,
  imports:[
  ...SHARED_IMPORTS,
    Step1Component,
    NzStepComponent,
    NzStepsComponent,
    PageHeaderComponent,
    NzCardComponent,
    Step2Component,
    Step3Component
  ],
  providers: [TransferService]
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
