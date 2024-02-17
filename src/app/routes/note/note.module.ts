import {NgModule, Type} from '@angular/core';
import {SharedModule} from '@shared';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {EditorComponent} from './editor/editor.component';
import {NoteRoutingModule} from './note-routing.module';


const COMPONENTS: Array<Type<void>> = [EditorComponent];

@NgModule({
    imports: [SharedModule, NoteRoutingModule, NzTreeModule, NzIconModule, ],
    exports: [

    ],
    declarations: [

    ]
})
export class NoteModule {
}
