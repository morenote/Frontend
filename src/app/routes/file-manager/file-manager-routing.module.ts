import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FileBrowserComponent} from "./file-browser/file-browser.component";


const routes: Routes = [
  {
    path: '',
    component: FileBrowserComponent
  },
  {
    path: 'browser',
    component: FileBrowserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagerRoutingModule { }
