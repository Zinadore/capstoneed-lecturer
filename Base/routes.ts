import { Routes } from '@angular/router';
import { HomeComponent } from '../Lecturer/home-component/home.component';
import { IsAuthenticatedGuard } from '../../shared/Guards/isAuthenticatedGuard';
import { UnitOverviewComponent } from '../Lecturer/unit/unit-overview-component/unitOverview.component';
import { LoginComponent } from './login-component/login.component';
import { UnitListComponent } from '../Lecturer/unit/unit-list-component/unitList.component';
import { NewUnitComponent } from '../Lecturer/unit/new-unit-component/newUnit.component';
import { ProjectDetailsComponent } from '../Lecturer/project/project-details-component/project-details.component';
import { NewProjectComponent } from '../Lecturer/project/new-project-component/new-project.component';
import { ProjectListComponent } from '../Lecturer/project/project-list-component/project-list.component';

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '', canActivate: [IsAuthenticatedGuard], children: [
    {
      path: 'units', children: [
      { path: '', pathMatch: 'full', component: UnitListComponent },
      { path: 'new', component: NewUnitComponent },
      { path: ':id', component: UnitOverviewComponent },
    ]
    },
    {
      path: 'projects', children: [
      { path: '', pathMatch: 'full', component: ProjectListComponent },
      { path: 'new', component: NewProjectComponent },
      { path: ':id', component: ProjectDetailsComponent }
    ]
    }
  ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];

//
// { path: 'units/:id', component: UnitOverviewComponent},
// { path: 'units', component: UnitListComponent }
