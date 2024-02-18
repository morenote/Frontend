import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'passport-register-result',
  standalone: true,
  templateUrl: './register-result.component.html',
  imports:[...SHARED_IMPORTS]
})
export class UserRegisterResultComponent {
  params = { email: '' };
  email = '';
  constructor(route: ActivatedRoute, public msg: NzMessageService) {
    this.params.email = this.email = route.snapshot.queryParams['email'] || 'ng-alain@example.com';
  }
}
