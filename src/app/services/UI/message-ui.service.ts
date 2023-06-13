import { Injectable } from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";

@Injectable({
  providedIn: 'root'
})
export class MessageUIService {

  constructor(private modal: NzModalService) { }
  //============================界面提示===================================
  ShowInfoMessage(message: string): void {
    this.modal.info({
      nzTitle: 'This is a notification message',
      nzContent: message,
      nzOnOk: () => console.log('Info OK')
    });
  }

  ShowSuccess(message: string): void {
    this.modal.success({
      nzTitle: 'This is a success message',
      nzContent: message
    });
  }

  ShowErrorMessage(message: string): void {
    this.modal.error({
      nzTitle: 'This is an error message',
      nzContent: message
    });
  }

  SHowWarningMessage(message: string): void {
    this.modal.warning({
      nzTitle: 'This is an warning message',
      nzContent: message
    });
  }
}
