import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TransferService } from './transfer.service';
import {SHARED_IMPORTS} from "@shared";
import {ResultComponent} from "@delon/abc/result";

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, ResultComponent]
})
export class Step3Component {
  get item(): TransferService {
    return this.srv;
  }

  constructor(private srv: TransferService) {}
}
