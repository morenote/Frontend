import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NoteRoutingModule } from './note-routing.module';
import {EditorComponent} from "./editor/editor.component";
import {NzTreeModule} from "ng-zorro-antd/tree";

const COMPONENTS: Type<void>[] = [
  EditorComponent
];


@NgModule({
  imports: [
    SharedModule,
    NoteRoutingModule,
    NzTreeModule
  ],
  declarations: COMPONENTS,
})
export class NoteModule { }
