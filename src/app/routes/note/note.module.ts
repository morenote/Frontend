import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { VditorMarkdownEditorComponent } from '../../my-components/Editor/VditorMarkdomEditor/vditor-markdown-editor.component';
import { EditorComponent } from './editor/editor.component';
import { NoteRoutingModule } from './note-routing.module';
import {
  TextbusEditorComponent
} from "../../my-components/Editor/TextbusEditor/textbus-editor.component";
import {
  ReNameModalComponent
} from "../../my-components/MyModal/re-name-modal-component/re-name-modal.component";

const COMPONENTS: Array<Type<void>> = [EditorComponent];

@NgModule({
  imports: [SharedModule, NoteRoutingModule, NzTreeModule, NzIconModule],
  declarations: [COMPONENTS, VditorMarkdownEditorComponent,TextbusEditorComponent,ReNameModalComponent]
})
export class NoteModule {}
