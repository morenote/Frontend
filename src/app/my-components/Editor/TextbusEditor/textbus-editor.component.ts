import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';


import {createEditor,Editor} from '@textbus/editor'
import {EditorInterface} from "../editor-interface";
import '@textbus/editor/bundles/textbus.min.css';



@Component({
  selector: 'app-textbus-editor',
  templateUrl: './textbus-editor.component.html',
  styleUrls: ['./textbus-editor.component.css']
})
export class TextbusEditorComponent implements OnInit, EditorInterface {

  @ViewChild('editorContainer', {read: ElementRef, static: true})
  editorContainer?: ElementRef;

  editor?: Editor;
  constructor() {
  }

  ngOnInit() {
    this.editor = createEditor(this.editorContainer!.nativeElement,{
      content : '<p>欢迎你使用&nbsp;<strong>Textbus</strong> 富文本编辑器...<br></p>'
    });

  }


  SetValue(value: string): void {

    console.log('SetValue is'+value.length);

    this.editor?.replaceContent(value);
  }
}
