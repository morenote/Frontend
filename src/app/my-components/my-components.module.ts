import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { MyComponentsRoutingModule } from './my-components-routing.module';
import {VditorMarkdomEditorComponent} from "./VditorMarkdomEditor/vditor-markdom-editor.component";


const COMPONENTS: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    MyComponentsRoutingModule

  ],
  declarations: COMPONENTS,
})
export class MyComponentsModule { }
