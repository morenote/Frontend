import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService, User } from '@delon/theme';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzFormControlComponent, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {SharedModule} from "@shared";

@Component({
  selector: 'passport-lock',
  templateUrl: './lock.component.html',
  standalone: true,
  imports: [
    NzAvatarComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzRowDirective,
    NzColDirective,
    SharedModule
  ],
  styleUrls: ['./lock.component.less']
})
export class UserLockComponent {
  f: UntypedFormGroup;

  get user(): User {
    return this.settings.user;
  }

  constructor(
    fb: UntypedFormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private settings: SettingsService,
    private router: Router
  ) {
    this.f = fb.group({
      password: [null, Validators.required]
    });
  }

  submit(): void {
    for (const i in this.f.controls) {
      this.f.controls[i].markAsDirty();
      this.f.controls[i].updateValueAndValidity();
    }
    if (this.f.valid) {
      console.log('Valid!');
      console.log(this.f.value);
      this.tokenService.set({
        token: '123'
      });
      this.router.navigate(['dashboard']);
    }
  }
}
