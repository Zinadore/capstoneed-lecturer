import { NgModule } from '@angular/core';
import { SidenavComponent } from './sidenav-component/sidenav.component';
import { UnitListComponent } from './unit/unitList-component/unitList.component';
import { HomeComponent } from './home-component/home.component';
import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from '../../shared/Directives/sharedDirectivesModule';
import { LoginComponent } from '../Base/login-component/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UnitListItemComponent } from './unit/unitListItem-component/unitListItem.component';
import { UnitDisplayComponent } from './unit/unitDisplay-component/unitDisplay.component';
import { UnitDetailsComponent } from './unit/unitDetails-component/unitDetails.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewUnitComponent } from './unit/newUnit-component/newUnit.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(ROUTES),
    SharedDirectivesModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SidenavComponent,
    HomeComponent,
    LoginComponent,
    UnitDisplayComponent,
    UnitDetailsComponent,
    UnitListComponent,
    UnitListItemComponent,
    NewUnitComponent
  ],
  providers: [],
  exports: [
    SidenavComponent,
    HomeComponent,
    UnitListComponent,
    UnitDetailsComponent
  ]
})
export class LecturerModule {

}
