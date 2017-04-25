import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidators, PasswordValidators, UniversalValidators,  } from 'ng2-validators';
import { CedValidators } from '../../../shared/Directives/ced.validators';
import { User, UserRegistrationData, UserType } from '../../../shared/Store/Models/user';
import { AuthenticationService } from '../../../shared/Services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ced-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent extends ComponentBase implements OnInit {

  public registrationForm: FormGroup;
  public lecturerInformationGrp: FormGroup;
  public isLecturerInfoVisible: boolean;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {
    super();
    this.isLecturerInfoVisible = false;
  }

  ngOnInit() {

    this.lecturerInformationGrp = this.fb.group({
      university: ['', Validators.required],
      position: ['', Validators.required]
    });

    this.registrationForm = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      lastName: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      email: ['', Validators.compose([Validators.required, EmailValidators.normal])],
      passwords: this.fb.group({
        password: ['', Validators.compose([Validators.required, UniversalValidators.noWhitespace, Validators.minLength(8)])],
        passwordConfirmation: ['', Validators.compose([Validators.required])],
      }),
      accountType: ['', Validators.compose([Validators.required, CedValidators.hasOneValueOf(['Student', 'Lecturer'])])],
      lecturerInformation: this.lecturerInformationGrp
    });

    this.registrationForm.controls['passwords'].setValidators(PasswordValidators.mismatchedPasswords('password', 'passwordConfirmation'));

    this.disposeOnDestroy(this.registrationForm.get('accountType').valueChanges.subscribe(value => {
        if(value === UserType.LECTURER) {
          this.lecturerInformationGrp.enable();
          this.isLecturerInfoVisible = true;
        }  else {
          this.lecturerInformationGrp.disable();
          this.isLecturerInfoVisible = false;
        }
      })
    );
  }

  logErrors() {
    // console.log(this.registrationForm.errors);
    // console.log(PasswordValidators.mismatchedPasswords);
    // console.log(this.registrationForm.controls['passwords'].errors);
    // console.log(this.registrationForm.get('passwords.password').errors);
    // console.log(this.registrationForm.get('passwords.passwordConfirmation').errors);
  }

  public getValidationStatus(controlName: string): boolean {
    return this.registrationForm.controls['firstName'].dirty &&
      this.registrationForm.controls['firstName'].valid;
  }

  public onSubmit() {
    let newUser: UserRegistrationData = {
      first_name: this.registrationForm.get('firstName').value,
      last_name: this.registrationForm.get('lastName').value,
      type: this.registrationForm.get('accountType').value,
      email: this.registrationForm.get('email').value,
      password: this.registrationForm.get('passwords.password').value,
      password_confirmation: this.registrationForm.get('passwords.passwordConfirmation').value
    };

    if(this.registrationForm.get('accountType').value === UserType.LECTURER) {
      newUser.university = this.lecturerInformationGrp.get('university').value;
      newUser.position = this.lecturerInformationGrp.get('position').value;
    }

    this.authService.register$(newUser).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/register_success']);
      },
      err => {
        console.log(err);
      }
    );


  }

}
