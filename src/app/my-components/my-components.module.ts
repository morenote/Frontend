import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';


import { MyComponentsRoutingModule } from './my-components-routing.module';
import {TextbusEditorComponent} from "./Editor/TextbusEditor/textbus-editor.component";

const COMPONENTS: Array<Type<void>> = [];

@NgModule({
  imports: [SharedModule, MyComponentsRoutingModule],
  declarations: COMPONENTS
})
export class MyComponentsModule {}
