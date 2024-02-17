import { Component, OnInit } from '@angular/core';
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {SharedModule} from "@shared";

@Component({
  selector: 'app-select-moal',
  templateUrl: './select-moal.component.html',
  styleUrls: ['./select-moal.component.less'],
  imports: [
    NzSelectComponent,
    NzOptionComponent,
    SharedModule
  ],
  standalone: true
})
export class SelectMoalComponent implements OnInit {

  isVisible = false;
  isOkLoading = false;
  public result?:boolean;
  public value?: any;

  public optionList:any;

  title:string='';

  constructor() { }

  ngOnInit() {
  }
  func:any;
  public showModal(title:string,optionList:any, func:any): void {
    this.title=title;
    this.optionList=optionList;
    this.isVisible = true;
    this.func=func;
  }
  public clearValue(){
    this.value='';
  }
  public setValue(value:string){
    this.value=value;
  }

  handleOk(): void {

    this.func(true, this.value);
    this.isVisible = false;
    this.isOkLoading = false;
  }

  handleCancel(): void {
    this.func(false, this.value);
    this.isVisible = false;
    this.result=false;
  }

}
