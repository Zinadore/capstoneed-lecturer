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

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
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
    }
  ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];

//
// { path: 'units/:id', component: UnitOverviewComponent},
// { path: 'units', component: UnitListComponent }
