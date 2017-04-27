import { EditUnitComponent } from '../Lecturer/unit/edit-unit-component/edit-unit.component';
import { EditAssignmentComponent } from '../Lecturer/assignment/edit-assignment-component/edit-assignment.component';
import { EditProjectComponent } from '../Lecturer/project/edit-project-component/edit-project.component';
import { Routes } from '@angular/router';
import { HomeComponent } from '../Lecturer/home-component/home.component';
import { IsAuthenticatedGuard } from '../../shared/Guards/isAuthenticatedGuard';
import { UnitDetailsComponent } from '../Lecturer/unit/unit-details-component/unit-details.component';
import { LoginComponent } from './login-component/login.component';
import { UnitListComponent } from '../Lecturer/unit/unit-list-component/unit-list.component';
import { NewUnitComponent } from '../Lecturer/unit/new-unit-component/newUnit.component';
import { ProjectDetailsComponent } from '../Lecturer/project/project-details-component/project-details.component';
import { NewProjectComponent } from '../Lecturer/project/new-project-component/new-project.component';
import { ProjectListComponent } from '../Lecturer/project/project-list-component/project-list.component';
import { AssignmentListComponent } from '../Lecturer/assignment/assignment-list-component/assignment-list.component';
import { AssignmentDetailsComponent } from '../Lecturer/assignment/assignment-details-component/assignment-details.component';
import { NewAssignmentComponent } from '../Lecturer/assignment/new-assignment-component/new-assignment.component';
import { EditProfileComponent } from '../Lecturer/edit-profile-component/edit-profile.component';
import { RegisterSuccessComponent } from './register-success-component/register-success.component';
import { RegisterComponent } from './register-component/register.component';
import { IterationsBarComponent } from '../Lecturer/iteration/iterations-bar-component/iterations-bar.component';
import { EditIterationsComponent } from '../Lecturer/iteration/edit-iterations-component/edit-iterations.component';
import { NewPeerAssessmentFormComponent } from "../Lecturer/assessment/new-pa-form-component/new-pa-form.component";
import { NewFormTemplateComponent } from '../Lecturer/form-template/new-form-template-component/new-form-template.component';
import { FormTemplateListComponent } from '../Lecturer/form-template/form-template-list-component/form-template-list.component';
import { EditFormTemplateComponent } from '../Lecturer/form-template/edit-form-template-component/edit-form-template.component';

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'beta-test', component: HomeComponent },
  { path: 'register', pathMatch: 'full', component: RegisterComponent },
  { path: 'register_success', pathMatch: 'full', component: RegisterSuccessComponent },
  { path: '', canActivate: [IsAuthenticatedGuard], children: [
    { path: 'units', children: [
      { path: '', pathMatch: 'full', component: UnitListComponent },
      { path: 'new', component: NewUnitComponent },
      { path: ':id', component: UnitDetailsComponent },
      { path: ':id/edit', component: EditUnitComponent }
      ]
    },
    { path: 'projects', children: [
      { path: '', pathMatch: 'full', component: ProjectListComponent },
      { path: 'new', component: NewProjectComponent },
      { path: ':id', component: ProjectDetailsComponent },
      { path: ':id/edit', component: EditProjectComponent }
      ]
    },
    { path: 'assignments', children: [
      { path: '', pathMatch: 'full', component: AssignmentListComponent },
      { path: 'new', component: NewAssignmentComponent },
      { path: ':id', component: AssignmentDetailsComponent },
      { path: ':id/edit', component: EditAssignmentComponent }
      ]
    },
    { path: 'profile', children: [
      { path: 'edit', pathMatch: 'full', component: EditProfileComponent }
    ] },
    { path: 'peer-assessments', children: [
      { path: 'new-form', component: NewPeerAssessmentFormComponent }
    ] },
    { path: 'form-templates', children: [
      { path: '', pathMatch: 'full', component: FormTemplateListComponent },
      { path: 'new', component: NewFormTemplateComponent },
      { path: ':id/edit', pathMatch: 'full', component: EditFormTemplateComponent }
    ] }
  ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];

//
// { path: 'units/:id', component: UnitOverviewComponent},
// { path: 'units', component: UnitListComponent }
