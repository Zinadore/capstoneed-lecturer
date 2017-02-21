import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../shared/Services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ced-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent extends ComponentBase implements OnInit{
  private loginForm: FormGroup;
  @ViewChild('firstFocus') _firstFocus;
  private redirectUrl: string;

  constructor(private _fb: FormBuilder, private _auth: AuthenticationService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      rememberMe: false
    });
    this._firstFocus.nativeElement.focus();

    this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  destroy() {
  }

  submit() {
    let username = this.loginForm.value['email'];
    let password = this.loginForm.value['password'];
    let remember = this.loginForm.value['rememberMe'];

    this._auth.login(username, password, remember);

    this.disposeOnDestroy(this._auth.isLoggedIn$.subscribe(value => {
      if(value)
        this.router.navigate([this.redirectUrl]);
    }))
  }
}
