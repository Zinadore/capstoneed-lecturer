import { Component, OnInit, Output, EventEmitter, HostBinding, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../../shared/Store/Models/user';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { Store } from '@ngrx/store';
import { AuthenticationService } from '../../../shared/Services/authentication.service';

@Component({
  selector: 'ced-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent extends ComponentBase implements OnInit, OnDestroy {
  private _user: Observable<User>;

  @Output('brandClick') _brandClicked: EventEmitter<boolean>;
  @HostBinding('class.toggled') _isBrandClicked: boolean;

  constructor(store: Store<IAppState>, private auth: AuthenticationService) {
    super();
    this._user = store.select('user');
    this._brandClicked = new EventEmitter<boolean>();
    this._isBrandClicked = false;
  }

  ngOnInit() {
    if (window.innerWidth > 1200) {
      this.onBrandClick();
    }
  }

  private onBrandClick():void {
    this._isBrandClicked = !this._isBrandClicked;
    this._brandClicked.emit(this._isBrandClicked);
  }

  private logout(): void {
    this.auth.logout();
  }
}
