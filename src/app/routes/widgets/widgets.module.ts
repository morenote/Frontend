import { NgModule, Type } from '@angular/core';
import { G2MiniAreaModule } from '@delon/chart/mini-area';
import { G2MiniBarModule } from '@delon/chart/mini-bar';
import { SharedModule } from '@shared';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsComponent } from './widgets/widgets.component';

const COMPONENTS: Array<Type<void>> = [WidgetsComponent];

@NgModule({
  imports: [SharedModule, WidgetsRoutingModule, NzCarouselModule, G2MiniBarModule, G2MiniAreaModule, NzBadgeModule, NzTagModule],
  declarations: COMPONENTS
})
export class WidgetsModule {}
