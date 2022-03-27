import { Component, OnInit } from '@angular/core';
import Vditor from 'vditor';
import {EditorInterface} from "../editor-interface";

@Component({
  selector: 'app-VditorMarkdownEditor',
  templateUrl: './vditor-markdown-editor.component.html',
  styleUrls: ['./vditor-markdown-editor.component.css']
})
export class VditorMarkdownEditorComponent implements OnInit ,EditorInterface{
  constructor() {}
  public vditor!: Vditor;
  ngOnInit() {
    this.vditor = new Vditor('vditor', {
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      after: () => {
        this.vditor.setValue('Hello, Vditor + Angular!');
      }
    });
  }
  public SetValue(value:string){
    this.vditor.setValue(value);
  }
}
