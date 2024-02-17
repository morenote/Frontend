import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {PageHeaderComponent} from "@delon/abc/page-header";
import {NzCardComponent} from "ng-zorro-antd/card";
import {ResultComponent} from "@delon/abc/result";
import {SHARED_IMPORTS} from "@shared";
import {NzStepComponent, NzStepsComponent} from "ng-zorro-antd/steps";

@Component({
  selector: 'app-result-success',
  templateUrl: './success.component.html',
  imports: [
    ...SHARED_IMPORTS,
    ResultComponent,
    NzStepsComponent,
    NzStepComponent,
  ],
  standalone: true
})
export class ProResultSuccessComponent {
  constructor(public msg: NzMessageService) {}
}
