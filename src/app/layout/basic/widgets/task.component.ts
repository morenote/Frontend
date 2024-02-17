import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCardModule} from "ng-zorro-antd/card";
import {SHARED_IMPORTS} from "@shared";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ ...SHARED_IMPORTS,NgTemplateOutlet, NzDropDownModule, NzBadgeModule, NzIconModule, NzSpinModule, NzGridModule, NzAvatarModule, NzCardModule],
  selector: 'header-task',
  standalone: true,
  template: `
    <div
      class="alain-default__nav-item"
      nz-dropdown
      [nzDropdownMenu]="taskMenu"
      nzTrigger="click"
      nzPlacement="bottomRight"
      (nzVisibleChange)="change()"
    >
      <nz-badge [nzDot]="true">
        <i nz-icon nzType="message" class="alain-default__nav-item-icon"></i>
      </nz-badge>
    </div>
    <nz-dropdown-menu #taskMenu="nzDropdownMenu">
      <div nz-menu class="wd-lg">
        <div *ngIf="loading" class="mx-lg p-lg">
          <nz-spin></nz-spin>
        </div>
        <nz-card *ngIf="!loading" nzTitle="Notifications" nzBordered="false" class="ant-card__body-nopadding">
          <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
          <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
            <div nz-col [nzSpan]="4" class="text-center">
              <nz-avatar [nzSrc]="'./assets/tmp/img/1.png'"></nz-avatar>
            </div>
            <div nz-col [nzSpan]="20">
              <strong>cipchk</strong>
              <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
            </div>
          </div>
          <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
            <div nz-col [nzSpan]="4" class="text-center">
              <nz-avatar [nzSrc]="'./assets/tmp/img/2.png'"></nz-avatar>
            </div>
            <div nz-col [nzSpan]="20">
              <strong>はなさき</strong>
              <p class="mb0">ハルカソラトキヘダツヒカリ</p>
            </div>
          </div>
          <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
            <div nz-col [nzSpan]="4" class="text-center">
              <nz-avatar [nzSrc]="'./assets/tmp/img/3.png'"></nz-avatar>
            </div>
            <div nz-col [nzSpan]="20">
              <strong>苏先生</strong>
              <p class="mb0">请告诉我，我应该说点什么好？</p>
            </div>
          </div>
          <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
            <div nz-col [nzSpan]="4" class="text-center">
              <nz-avatar [nzSrc]="'./assets/tmp/img/4.png'"></nz-avatar>
            </div>
            <div nz-col [nzSpan]="20">
              <strong>Kent</strong>
              <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
            </div>
          </div>
          <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
            <div nz-col [nzSpan]="4" class="text-center">
              <nz-avatar [nzSrc]="'./assets/tmp/img/5.png'"></nz-avatar>
            </div>
            <div nz-col [nzSpan]="20">
              <strong>Jefferson</strong>
              <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
            </div>
          </div>
          <div nz-row>
            <div nz-col [nzSpan]="24" class="pt-md border-top-1 text-center text-grey point">See All</div>
          </div>
        </nz-card>
      </div>
    </nz-dropdown-menu>
  `
})
export class HeaderTaskComponent {
  loading = true;

  constructor(private cdr: ChangeDetectorRef) {}

  change(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }
}
