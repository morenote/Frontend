import {NgModule, Type} from '@angular/core';
import {SharedModule} from '@shared';
import {FileManagerRoutingModule} from './file-manager-routing.module';
import {FileBrowserComponent} from "./file-browser/file-browser.component";
import {NoteModule} from "../note/note.module";
import {MyComponentsModule} from "../../my-components/my-components.module";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {QRModule} from "@delon/abc/qr";

const COMPONENTS: Type<void>[] = [FileBrowserComponent];

@NgModule({
    imports: [
        SharedModule,
        FileManagerRoutingModule,
        NoteModule,
        MyComponentsModule,
        ScrollingModule,
        QRModule
    ],
  declarations: COMPONENTS,
})
export class FileManagerModule {
}
