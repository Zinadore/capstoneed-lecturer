import { Component, OnInit, ViewChild } from '@angular/core';
import '../../style/app.scss';
import { AuthenticationService } from '../../shared/Services/authentication.service';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';

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

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(private authService: AuthenticationService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.authService.getMe();
    this.toastrService.overlayContainer = this.toastContainer;
  }
}
