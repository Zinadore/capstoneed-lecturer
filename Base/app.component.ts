import { Component, OnInit } from '@angular/core';
import '../../style/app.scss';
import { AuthenticationService } from '../../shared/Services/authentication.service';

@Component({
  selector: 'ced-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  private _open: boolean = false;

  private toggleSidenav(event) {
    this._open = event;
  }
  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.getMe()
  }
}
