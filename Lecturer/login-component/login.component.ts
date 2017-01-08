import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../shared/Services/authenticationService';

@Component({
  selector: 'ced-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent extends ComponentBase implements OnInit{
  private loginForm: FormGroup;
  @ViewChild('firstFocus') _firstFocus;

  constructor(private _fb: FormBuilder, private _auth: AuthenticationService) {
    super();
  }

  ngOnInit() {
    console.log('login component init');
    this.loginForm = this._fb.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      rememberMe: false
    });
    this._firstFocus.nativeElement.focus();
  }

  destroy() {
    console.log('login component destroyed');
  }

  submit() {
    let username = this.loginForm.value['email'];
    let password = this.loginForm.value['password'];
    let remember = this.loginForm.value['rememberMe'];

    this._auth.login(username, password, remember);
  }
}
