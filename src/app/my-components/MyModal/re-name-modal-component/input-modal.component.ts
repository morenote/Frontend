import { Component, OnInit } from '@angular/core';
import {NzModalComponent} from "ng-zorro-antd/modal";
import {SharedModule} from "@shared";

@Component({
  selector: 'app-re-name-modal-component',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.css'],
  imports: [
    NzModalComponent,
    SharedModule
  ],
  standalone: true
})
export class InputModalComponent implements OnInit {


  isVisible = false;
  isOkLoading = false;
  public result?:boolean;
  public value?: string;

  title:string='';
  placeholder:string='';
  constructor() { }

  ngOnInit() {
  }
  func:any;
  public showModal(title:string,placeholder:string, func:any): void {
    this.title=title;
    this.placeholder=placeholder;
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
