import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-pass-word-modal-component',
  templateUrl: './change-pass-word-modal-component.component.html',
  styles: [
  ]
})
export class ChangePassWordModalComponentComponent implements OnInit {


  isVisible = false;
  isOkLoading = false;
  public result?:boolean;
  public value?: any;

  public optionList:any;

  title:string='';

  //密码输入
  password0Visible = false;
  password1Visible = false;
  password2Visible = false;



  passwordOld?:string;
  password1?: string;
  password2?: string;

  constructor() { }

  ngOnInit() {
  }
  func:any;
  public showModal(title:string, func:any): void {
    this.title=title;
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

    this.func(true,this.passwordOld, this.password1,this.password2);
    this.passwordOld='';
    this.password1='';
    this.password2='';
    this.isVisible = false;
    this.isOkLoading = false;
  }

  handleCancel(): void {
    this.func(false,this.passwordOld, this.password1,this.password2);
    this.passwordOld='';
    this.password1='';
    this.password2='';
    this.isVisible = false;
    this.result=false;
  }
}
