import {NgModule, Type} from '@angular/core';
import {SharedModule} from '@shared';


import {MyComponentsRoutingModule} from './my-components-routing.module';
import {TextbusEditorComponent} from "./Editor/TextbusEditor/textbus-editor.component";
import {SerchNoteModalComponent} from "./MyModal/serch-note-modal/serch-note-modal.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {SelectMoalComponent} from "./MyModal/select-moal/select-moal.component";
import {
  ChangePassWordModalComponentComponent
} from "./MyModal/change-pass-word-modal-component/change-pass-word-modal-component.component";

const COMPONENTS: Array<Type<void>> = [
  SerchNoteModalComponent,
  SelectMoalComponent,
  ChangePassWordModalComponentComponent
];

@NgModule({
  imports: [SharedModule, MyComponentsRoutingModule, ScrollingModule],
  exports: [
    SerchNoteModalComponent,
    SelectMoalComponent,
    ChangePassWordModalComponentComponent
  ],
  declarations: COMPONENTS
})
export class MyComponentsModule {
}
