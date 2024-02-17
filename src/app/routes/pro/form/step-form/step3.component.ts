import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TransferService } from './transfer.service';
import {ResultComponent} from "@delon/abc/result";
import {SVComponent} from "@delon/abc/sv";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  standalone: true,
  imports: [
    ResultComponent,
    SVComponent,
    NzButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step3Component {
  get item(): TransferService {
    return this.srv;
  }

  constructor(private srv: TransferService) {}
}
