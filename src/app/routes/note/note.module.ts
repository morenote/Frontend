import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { VditorMarkdownEditorComponent } from '../../my-components/VditorMarkdomEditor/vditor-markdown-editor.component';
import { EditorComponent } from './editor/editor.component';
import { NoteRoutingModule } from './note-routing.module';

const COMPONENTS: Array<Type<void>> = [EditorComponent];

@NgModule({
  imports: [SharedModule, NoteRoutingModule, NzTreeModule, NzIconModule],
  declarations: [COMPONENTS, VditorMarkdownEditorComponent]
})
export class NoteModule {}
