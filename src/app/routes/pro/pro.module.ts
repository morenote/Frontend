import { NgModule } from '@angular/core';
import { AvatarListModule } from '@delon/abc/avatar-list';
import { EllipsisModule } from '@delon/abc/ellipsis';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { TagSelectModule } from '@delon/abc/tag-select';
import { CurrencyPipeModule } from '@delon/util/pipes/currency';
import { SharedModule } from '@shared';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzStepsModule } from 'ng-zorro-antd/steps';

import { ProAccountCenterApplicationsComponent } from './account/center/applications/applications.component';
import { ProAccountCenterArticlesComponent } from './account/center/articles/articles.component';
import { ProAccountCenterComponent } from './account/center/center.component';
import { ProAccountCenterProjectsComponent } from './account/center/projects/projects.component';
import { ProAccountSettingsBaseComponent } from './account/settings/base/base.component';
import { ProAccountSettingsBindingComponent } from './account/settings/binding/binding.component';
import { ProAccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
import { ProAccountSettingsSecurityComponent } from './account/settings/security/security.component';
import { ProAccountSettingsComponent } from './account/settings/settings.component';
import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
import { BasicFormComponent } from './form/basic-form/basic-form.component';
import { StepFormComponent } from './form/step-form/step-form.component';
import { Step1Component } from './form/step-form/step1.component';
import { Step2Component } from './form/step-form/step2.component';
import { Step3Component } from './form/step-form/step3.component';
import { ProListApplicationsComponent } from './list/applications/applications.component';
import { ProListArticlesComponent } from './list/articles/articles.component';
import { ProBasicListComponent } from './list/basic-list/basic-list.component';
import { ProBasicListEditComponent } from './list/basic-list/edit/edit.component';
import { ProCardListComponent } from './list/card-list/card-list.component';
import { ProListLayoutComponent } from './list/list/list.component';
import { ProListProjectsComponent } from './list/projects/projects.component';
import { ProTableListComponent } from './list/table-list/table-list.component';
import { ProRoutingModule } from './pro-routing.module';
import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
import { ProProfileBaseComponent } from './profile/basic/basic.component';
import { ProResultFailComponent } from './result/fail/fail.component';
import { ProResultSuccessComponent } from './result/success/success.component';
import {ProAccountCenterDocumentsComponent} from "./account/center/documents/documents.component";
import {ProAccountCenterFilesComponent} from "./account/center/files/files.component";
import {CreateRepositoryFormComponent} from "./form/create-repository/create-repository-form.component";
import {LoginAuditProTableListComponent} from "./list/login-audit-table-list/table-list.component";

import {ProRealPersonAuthenticationComponent} from "./account/settings/RealPersonAuthentication/rpa.component";
import { ProAccountSettingsEditorComponent } from './account/settings/editor/editor.component';
import {NoteModule} from "../note/note.module";
import {NzUploadComponent} from "ng-zorro-antd/upload";
import {SelectMoalComponent} from "../../my-components/MyModal/select-moal/select-moal.component";
import {
  ChangePassWordModalComponentComponent
} from "../../my-components/MyModal/change-pass-word-modal-component/change-pass-word-modal-component.component";
import {InputModalComponent} from "../../my-components/MyModal/re-name-modal-component/input-modal.component";
import {ResultComponent} from "@delon/abc/result";



const COMPONENTS = [
  BasicFormComponent,
  CreateRepositoryFormComponent,
  StepFormComponent,
  AdvancedFormComponent,
  ProTableListComponent,
  LoginAuditProTableListComponent,
  ProBasicListComponent,
  ProCardListComponent,
  ProListLayoutComponent,
  ProListArticlesComponent,
  ProListProjectsComponent,
  ProListApplicationsComponent,

  ProProfileBaseComponent,
  ProProfileAdvancedComponent,
  ProResultSuccessComponent,
  ProResultFailComponent,
  ProAccountCenterComponent,
  ProAccountCenterArticlesComponent,
  ProAccountCenterProjectsComponent,
  ProAccountCenterApplicationsComponent,
  ProAccountCenterDocumentsComponent,
  ProAccountCenterFilesComponent,
  ProAccountSettingsComponent,
  ProAccountSettingsBaseComponent,
  ProRealPersonAuthenticationComponent,//实名
  ProAccountSettingsEditorComponent,//编辑器设置
  ProAccountSettingsSecurityComponent,
  ProAccountSettingsBindingComponent,
  ProAccountSettingsNotificationComponent,
  Step1Component,
  Step2Component,
  Step3Component,
  ProBasicListEditComponent
];

@NgModule({
  imports: [
    SharedModule,
    ProRoutingModule,
    EllipsisModule,
    TagSelectModule,
    AvatarListModule,
    FooterToolbarModule,
    NzPaginationModule,
    NzStepsModule,

    CurrencyPipeModule,

    NoteModule,
    NzUploadComponent,
    SelectMoalComponent,
    ChangePassWordModalComponentComponent,
    InputModalComponent,
    ResultComponent
  ],
  declarations: []
})
export class ProModule {}
