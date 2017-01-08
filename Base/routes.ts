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
import { UnitDetailsComponent } from '../Lecturer/unitDetails-component/unitDetails.component';

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'units/:id', component: UnitDetailsComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home'}
];
