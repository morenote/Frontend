import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';


import { MyComponentsRoutingModule } from './my-components-routing.module';
import {TextbusEditorComponent} from "./Editor/TextbusEditor/textbus-editor.component";
import {SerchNoteModalComponent} from "./MyModal/serch-note-modal/serch-note-modal.component";
import {ScrollingModule} from "@angular/cdk/scrolling";

const COMPONENTS: Array<Type<void>> = [SerchNoteModalComponent];

@NgModule({
  imports: [SharedModule, MyComponentsRoutingModule, ScrollingModule,],
  exports: [
    SerchNoteModalComponent
  ],
  declarations: COMPONENTS
})
export class MyComponentsModule {}
