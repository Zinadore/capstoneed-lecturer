import { Component } from '@angular/core';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { User } from '../../../shared/Store/Models/user';
import { Observable } from 'rxjs';
@Component({
  selector: 'ced-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent extends ComponentBase {
  private _user: Observable<User>;

  constructor(store: Store<IAppState>) {
    super();
    this._user = store.select('user');
  }


}
