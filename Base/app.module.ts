import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
// import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';


import { AppComponent } from './app.component';
// import { ROUTES } from './routes';
import { CedStoreModule } from '../../shared/Store/cedStore.module';
import { ServicesModule } from '../../shared/Services/services.module';
import { HeaderComponent } from './header-component/header.component';
import { RxContext } from '../../shared/Directives/rxContext';
import { LecturerModule } from '../Lecturer/lecturer.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    CedStoreModule.provideStore(),
    ServicesModule.forRoot(),
    SidebarModule,
    LecturerModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    // RxContext
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
