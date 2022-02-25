import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class HelperServiceService {
  constructor(private modal: NzModalService) {}

  coerceToArrayBuffer(thing: any) {
    if (typeof thing === 'string') {
      // base64url to base64
      thing = thing.replace(/-/g, '+').replace(/_/g, '/');

      // base64 to Uint8Array
      var str = window.atob(thing);
      var bytes = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      thing = bytes;
    }

    // Array to Uint8Array
    if (Array.isArray(thing)) {
      thing = new Uint8Array(thing);
    }

    // Uint8Array to ArrayBuffer
    if (thing instanceof Uint8Array) {
      thing = thing.buffer;
    }

    // error if none of the above worked
    if (!(thing instanceof ArrayBuffer)) {
      throw new TypeError(`could not coerce  to ArrayBuffer`);
    }

    return thing;
  }

  public coerceToBase64Url(thing: any): any {
    // Array or ArrayBuffer to Uint8Array
    if (Array.isArray(thing)) {
      thing = Uint8Array.from(thing);
    }

    if (thing instanceof ArrayBuffer) {
      thing = new Uint8Array(thing);
    }

    // Uint8Array to base64
    if (thing instanceof Uint8Array) {
      let str = '';
      let len = thing.byteLength;

      for (let i = 0; i < len; i++) {
        str += String.fromCharCode(thing[i]);
      }
      thing = window.btoa(str);
    }
  }
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
