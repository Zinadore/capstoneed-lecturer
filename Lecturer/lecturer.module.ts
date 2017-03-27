import { NgModule } from '@angular/core';
import { SidenavComponent } from './sidenav-component/sidenav.component';
import { UnitListComponent } from './unit/unit-list-component/unit-list.component';
import { HomeComponent } from './home-component/home.component';
import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from '../../shared/Directives/sharedDirectivesModule';
import { LoginComponent } from '../Base/login-component/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UnitListItemComponent } from './unit/unit-list-item-component/unitListItem.component';
import { UnitDisplayComponent } from './unit/unit-display-component/unitDisplay.component';
import { UnitOverviewComponent } from './unit/unit-overview-component/unit-overview.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewUnitComponent } from './unit/new-unit-component/newUnit.component';
import { NewProjectComponent } from './project/new-project-component/new-project.component';
import { ProjectDetailsComponent } from './project/project-details-component/project-details.component';
import { ProjectListComponent } from './project/project-list-component/project-list.component';
import { EditProjectComponent } from './project/edit-project-component/edit-project.component';
import { AssignmentListComponent } from './assignment/assignment-list-component/assignment-list.component';
import { AssignmentDetailsComponent } from './assignment/assignment-details-component/assignment-details.component';
import { NewAssignmentComponent } from './assignment/new-assignment-component/new-assignment.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(ROUTES),
    SharedDirectivesModule,
    ReactiveFormsModule,
    NgxMyDatePickerModule,
    NgxDatatableModule
  ],
  declarations: [
    SidenavComponent,
    HomeComponent,
    LoginComponent,
    UnitDisplayComponent,
    UnitOverviewComponent,
    UnitListComponent,
    UnitListItemComponent,
    NewUnitComponent,
    NewProjectComponent,
    ProjectDetailsComponent,
    ProjectListComponent,
    EditProjectComponent,
    AssignmentListComponent,
    AssignmentDetailsComponent,
    NewAssignmentComponent
  ],
  providers: [NgxMyDatePickerModule],
  exports: [
    SidenavComponent,
    HomeComponent,
    UnitListComponent,
    UnitOverviewComponent
  ]
})
export class LecturerModule {

}
