import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { MatchControl } from '@delon/util/form';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { finalize } from 'rxjs/operators';
import {UserService} from "../../services/User/user.service";
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[...SHARED_IMPORTS]
})
export class UserRegisterComponent implements OnDestroy {
  constructor(fb: FormBuilder,
              private router: Router,
              private http: _HttpClient,
              private userService:UserService,
              private cdr: ChangeDetectorRef) {
    this.form = fb.group(
      {
        mail: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
        confirm: [null, [Validators.required, Validators.minLength(6)]],
        mobilePrefix: ['+86'],
        mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
        captcha: [null, [Validators.required]]
      },
      {
        validators: MatchControl('password', 'confirm')
      }
    );
  }

  // #region fields

  get mail(): AbstractControl {
    return this.form.get('mail')!;
  }
  get password(): AbstractControl {
    return this.form.get('password')!;
  }
  get confirm(): AbstractControl {
    return this.form.get('confirm')!;
  }
  get mobile(): AbstractControl {
    return this.form.get('mobile')!;
  }
  get captcha(): AbstractControl {
    return this.form.get('captcha')!;
  }
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap: { [key: string]: 'success' | 'normal' | 'exception' } = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception'
  };

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  static checkPassword(control: FormControl): NzSafeAny {
    if (!control) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.cdr.detectChanges();
    this.interval$ = setInterval(() => {
      this.count -= 1;
      this.cdr.detectChanges();
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  async submit() {
    this.error = '';
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    this.loading = true;
    this.cdr.detectChanges();
    await this.userService.Register(this.mail.value, this.password.value);
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
