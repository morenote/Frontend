import { Component, OnInit } from '@angular/core';
import {EditorInterface} from "../../editor-interface";

@Component({
  selector: 'app-am-editor',
  templateUrl: './am-editor.component.html',
  styles: [
  ]
})
export class AmEditorComponent implements OnInit,EditorInterface {

  constructor() { }

  ngOnInit(): void {
  }

  Destroy(): void {
  }

  Disabled(): void {
  }

  Enable(): void {
  }

  GetContent(): string {
    return "";
  }

  GetYourName(): string {
    return "";
  }

  IsReady(): boolean {
    return false;
  }

  SetContent(value: string, clearCache: boolean): void {
  }

}
