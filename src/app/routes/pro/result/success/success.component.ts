import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SHARED_IMPORTS} from "@shared";
import {NzStepComponent, NzStepsComponent} from "ng-zorro-antd/steps";
import {ResultComponent} from "@delon/abc/result";

@Component({
  selector: 'app-result-success',
  standalone: true,
  templateUrl: './success.component.html',
  imports: [...SHARED_IMPORTS, NzStepsComponent, NzStepComponent, ResultComponent]

})
export class ProResultSuccessComponent {
  constructor(public msg: NzMessageService) {}
}
