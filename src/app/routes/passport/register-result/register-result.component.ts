import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {ResultComponent} from "@delon/abc/result";

@Component({
  selector: 'passport-register-result',
  standalone: true,
  imports: [
    NzButtonComponent,
    ResultComponent
  ],
  templateUrl: './register-result.component.html'
})
export class UserRegisterResultComponent {
  params = { email: '' };
  email = '';
  constructor(route: ActivatedRoute, public msg: NzMessageService) {
    this.params.email = this.email = route.snapshot.queryParams['email'] || 'ng-alain@example.com';
  }
}
