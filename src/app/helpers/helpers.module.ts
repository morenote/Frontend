import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { HelpersRoutingModule } from './helpers-routing.module';

const COMPONENTS: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    HelpersRoutingModule
  ],
  declarations: COMPONENTS,
})
export class HelpersModule { }
