import {NgModule, Type} from '@angular/core';
import {SharedModule} from '@shared';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTreeModule} from 'ng-zorro-antd/tree';

import { VditorMarkdownEditorComponent } from '../../my-components/Editor/VditorMarkdomEditor/vditor-markdown-editor.component';
import {EditorComponent} from './editor/editor.component';
import {NoteRoutingModule} from './note-routing.module';
import { TextbusEditorComponent } from "../../my-components/Editor/TextbusEditor/textbus-editor.component";
import { InputModalComponent } from "../../my-components/MyModal/re-name-modal-component/input-modal.component";
import {MyComponentsModule} from "../../my-components/my-components.module";
import {AmEditorComponent} from "../../my-components/Editor/AM/am-editor/am-editor.component";


const COMPONENTS: Array<Type<void>> = [EditorComponent];

@NgModule({
  imports: [SharedModule, NoteRoutingModule, NzTreeModule, NzIconModule, MyComponentsModule],
  declarations: [COMPONENTS,
    VditorMarkdownEditorComponent,
    AmEditorComponent,
    TextbusEditorComponent,
    InputModalComponent
  ]
})
export class NoteModule {
}
