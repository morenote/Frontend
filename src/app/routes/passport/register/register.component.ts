import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {_HttpClient, I18nPipe} from '@delon/theme';
import { MatchControl } from '@delon/util/form';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { finalize } from 'rxjs/operators';
import {UserService} from "../../../services/User/user.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NgSwitch} from "@angular/common";


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [

    ReactiveFormsModule,
    I18nPipe,
    RouterLink,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzPopoverModule,
    NzProgressModule,
    NzSelectModule,
    NzGridModule,
    NzButtonModule,
    NgSwitch
  ],
  selector: 'passport-register',
  standalone: true,
  styleUrls: ['./register.component.less'],
  templateUrl: './register.component.html'
})
export class UserRegisterComponent implements OnDestroy {
  constructor(fb: UntypedFormBuilder,
              private router: Router,
              private http: _HttpClient,
              public nzMessage: NzMessageService,
              private  userService:UserService,
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
  form: UntypedFormGroup;
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

  static checkPassword(control: UntypedFormControl): NzSafeAny {
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
    // this.http
    //   .post('/register?_allow_anonymous=true', data)
    //   .pipe(
    //     finalize(() => {
    //       this.loading = false;
    //       this.cdr.detectChanges();
    //     })
    //   )
    //   .subscribe(() => {
    //     this.router.navigate(['passport', 'register-result'], { queryParams: { email: data.mail } });
    //   });
    let apiRe = await this.userService.Register(this.mail.value, this.password.value);
    if (apiRe.Ok){
      await this.router.navigate(['passport', 'register-result'], {queryParams: {email: data.mail}});
    }else {
      this.nzMessage.error("注册失败："+apiRe.Msg);
    }
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
