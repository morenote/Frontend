import { Component, OnInit } from '@angular/core';
import Vditor from "vditor";

@Component({
  selector: 'app-VditorMarkdomEditor',
  templateUrl: './vditor-markdom-editor.component.html',
  styleUrls: ['./vditor-markdom-editor.component.css']
})
export class VditorMarkdomEditorComponent implements OnInit {

  constructor() { }
  public vditor!:Vditor ;
  ngOnInit() {
    this.vditor = new Vditor('vditor', {
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      after: () => {
        this.vditor.setValue('Hello, Vditor + Angular!');
      }
    });
  }

}
