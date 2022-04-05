import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-re-name-modal-component',
  templateUrl: './re-name-modal.component.html',
  styleUrls: ['./re-name-modal.component.css']
})
export class ReNameModalComponent implements OnInit {
  isVisible = false;
  isOkLoading = false;
  public result?:boolean;
  public value?: string;


  constructor() { }

  ngOnInit() {
  }
  func:any;
  public showModal(func:any): void {
    this.isVisible = true;
    this.func=func;
  }
  public clearValue(){
    this.value='';
  }

  handleOk(): void {
    this.func(this.value);
    this.isVisible = false;
    this.isOkLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.result=false;
  }


}
