import { HoursWorkedProjectComponent } from './stats/hours-worked-project-component/hours-worked-project.component';
import { HoursWorkedAssignmentComponent } from './stats/hours-worked-assignment-component/hours-worked-assignment.component';
import { PercentCompletionComponent } from './stats/percent-completion-component/percent-completion.component';
import { LogsHeatmapComponent } from './stats/logs-heatmap-component/logs-heatmap.component';
import { EditUnitComponent } from './unit/edit-unit-component/edit-unit.component';
import { EditAssignmentComponent } from './assignment/edit-assignment-component/edit-assignment.component';
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
import { UnitDetailsComponent } from './unit/unit-details-component/unit-details.component';
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
import { ChartModule } from 'angular2-highcharts';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(ROUTES),
    SharedDirectivesModule,
    ReactiveFormsModule,
    NgxMyDatePickerModule,
    NgxDatatableModule,
    ChartModule.forRoot(require('highcharts'),
                        require('highcharts/modules/exporting'),
                        require('highcharts/modules/heatmap'))
  ],
  declarations: [
    SidenavComponent,
    HomeComponent,
    LoginComponent,
    UnitDisplayComponent,
    UnitDetailsComponent,
    UnitListComponent,
    UnitListItemComponent,
    NewUnitComponent,
    NewProjectComponent,
    ProjectDetailsComponent,
    ProjectListComponent,
    EditProjectComponent,
    AssignmentListComponent,
    AssignmentDetailsComponent,
    NewAssignmentComponent,
    EditAssignmentComponent,
    EditUnitComponent,
    EditProfileComponent,
    IterationsBarComponent,
    EditIterationsComponent,
    NewPeerAssessmentFormComponent,
    DragableQuestionListsComponent,
    NewPaQuestionComponent,
    NewFormTemplateComponent,
    FormTemplateListComponent,
    EditFormTemplateComponent,
    AssignmentOverviewComponent,
    ProjectRankingsComponent,
    ProjectRankingBarComponent,
    LogsHeatmapComponent
    PercentCompletionComponent,
    HoursWorkedAssignmentComponent,
    HoursWorkedProjectComponent,
  ],
  providers: [NgxMyDatePickerModule],
  exports: [
    SidenavComponent,
    HomeComponent,
    UnitListComponent,
    UnitDetailsComponent
  ]
})
export class LecturerModule {

}
