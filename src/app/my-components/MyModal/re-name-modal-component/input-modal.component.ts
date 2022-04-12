import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-re-name-modal-component',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.css']
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
