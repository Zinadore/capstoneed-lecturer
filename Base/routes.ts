// import { Routes } from '@angular/router';
// import { HomeComponent } from './home-component/home.component';
// import { LoginComponent } from './login-component/login.component';
//
// export const ROUTES: Routes = [
//   { path: 'home', component: HomeComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'student', loadChildren: '../Student#StudentModule' },
//   { path: '', pathMatch: 'full', redirectTo: 'home' }
// ];

import { Routes } from '@angular/router';
import { HomeComponent } from '../Lecturer/home-component/home.component';
import { IsAuthenticatedGuard } from '../../shared/Guards/isAuthenticatedGuard';
import { UnitDetailsComponent } from '../Lecturer/unit/unitDetails-component/unitDetails.component';
import { LoginComponent } from './login-component/login.component';
import { UnitListComponent } from '../Lecturer/unit/unitList-component/unitList.component';
import { NewUnitComponent } from '../Lecturer/unit/newUnit-component/newUnit.component';

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', canActivate: [IsAuthenticatedGuard], children: [
    { path: 'units', children: [
      { path: '', pathMatch: 'full', component: UnitListComponent },
      { path: 'new', component: NewUnitComponent },
      { path: ':id', component: UnitDetailsComponent},
    ]}
  ]},
  { path: '',  pathMatch: 'full', redirectTo: 'home' }
];

//
// { path: 'units/:id', component: UnitDetailsComponent},
// { path: 'units', component: UnitListComponent }
