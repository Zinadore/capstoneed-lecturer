import { NgModule } from '@angular/core';
import { SidenavComponent } from './sidenav-component/sidenav.component';
import { UnitListComponent } from './unitList-component/unitList.component';
import { HomeComponent } from './home-component/home.component';
import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from '../../shared/Directives/sharedDirectivesModule';
import { LoginComponent } from './login-component/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UnitListItemComponent } from './unitListItem-component/unitListItem.component';
import { UnitDisplayComponent } from './unitDisplay-component/unitDisplay.component';
import { UnitDetailsComponent } from './unitDetails-component/unitDetails.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    UnitListItemComponent
  ],
  providers: [],
  exports: [
    SidenavComponent,
    HomeComponent,
    UnitListComponent
  ]
})
export class LecturerModule {

}
