import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NoteRoutingModule } from './note-routing.module';
import {EditorComponent} from "./editor/editor.component";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {VditorMarkdomEditorComponent} from "../../my-components/VditorMarkdomEditor/vditor-markdom-editor.component";
import {NzIconModule} from "ng-zorro-antd/icon";


const COMPONENTS: Type<void>[] = [
  EditorComponent
];


@NgModule({
  imports: [
    SharedModule,
    NoteRoutingModule,
    NzTreeModule,
    NzIconModule

  ],
  declarations: [
    COMPONENTS,
    VditorMarkdomEditorComponent
  ],
})
export class NoteModule { }
