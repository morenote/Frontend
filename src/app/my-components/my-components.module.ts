import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';

import { VditorMarkdownEditorComponent } from './VditorMarkdomEditor/vditor-markdown-editor.component';
import { MyComponentsRoutingModule } from './my-components-routing.module';

const COMPONENTS: Array<Type<void>> = [];

@NgModule({
  imports: [SharedModule, MyComponentsRoutingModule],
  declarations: COMPONENTS
})
export class MyComponentsModule {}
