import { Component } from '@angular/core';
import {SHARED_IMPORTS} from "@shared";
import {ResultComponent} from "@delon/abc/result";

@Component({
  selector: 'app-result-fail',
  standalone: true,
  imports: [...SHARED_IMPORTS, ResultComponent],
  templateUrl: './fail.component.html'
})
export class ProResultFailComponent {}
