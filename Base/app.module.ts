import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { ROUTES } from './routes';
import { CedStoreModule } from '../../shared/Store/cedStore.module';
import { ServicesModule } from '../../shared/Services/services.module';
import { HeaderComponent } from './header-component/header.component';
import { LecturerModule } from '../Lecturer/lecturer.module';
import { SharedDirectivesModule } from '../../shared/Directives/sharedDirectivesModule';
import { GuardsModule } from '../../shared/Guards/guards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register-component/register.component';
import { RegisterSuccessComponent } from './register-success-component/register-success.component';
import { ProjectEvaluationComponent } from '../Lecturer/project-evaluation/project-evaluation-component/project-evaluation.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';


const ToastrGlobalConf: any = {
  maxOpened: 0, // max toasts opened. Toasts will be queued
  autoDismiss: false, // dismiss current toast when max is reached
  iconClasses : { // classes used on toastr service methods
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },
  newestOnTop: true, // new toast placement
  preventDuplicates: false, // block duplicate messages
  // toastComponent = Toast, // the angular 2 component that will be used
  closeButton: true, // show close button
  timeOut: 5000, // time to live
  enableHtml: false, // allow html in message. (UNSAFE)
  extendedTimeOut: 10000, // time to close after a user hovers over toast
  progressBar: true, // show progress bar
  toastClass: 'toast', // class on toast
  positionClass: 'toast-top-left', // class on toast
  titleClass: 'toast-title', // class inside toast on title
  messageClass: 'toast-message', // class inside toast on message
  tapToDismiss: true, // close on click
  onActivateTick: false, // fire a ApplicationRef.tick() from the toast component when activated. Might help show the toast if you are firing it from a websocket
};

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    ToastrModule.forRoot(ToastrGlobalConf),
    ToastContainerModule.forRoot(),
    CedStoreModule.provideStore(),
    ServicesModule.forRoot(),
    SharedDirectivesModule,
    LecturerModule,
    GuardsModule,
    BrowserAnimationsModule,
    RoundProgressModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    ProjectEvaluationComponent,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}



