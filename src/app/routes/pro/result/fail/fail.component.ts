import { Component } from '@angular/core';
import {SHARED_IMPORTS} from "@shared";
import {ResultComponent} from "@delon/abc/result";

@Component({
  selector: 'app-result-fail',
  standalone: true,
  templateUrl: './fail.component.html',
  imports: [...SHARED_IMPORTS, ResultComponent]
})
export class ProResultFailComponent {}
