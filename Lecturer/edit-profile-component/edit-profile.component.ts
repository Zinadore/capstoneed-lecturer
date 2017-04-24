import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../shared/Directives/componentBase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../shared/Store/Reducers/index';
import { User, UserType } from '../../../shared/Store/Models/user';
import { EmailValidators, UniversalValidators, PasswordValidators } from 'ng2-validators';
import { AuthenticationService } from '../../../shared/Services/authentication.service';

@Component({
  selector: 'ced-edit-profile',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.component.scss']
})
export class EditProfileComponent extends ComponentBase implements OnInit {

  private editProfileForm: FormGroup;
  private lecturerInformationGrp: FormGroup;
  private passwordChangeForm: FormGroup;
  private user: User;
  public isLecturerInfoVisible: boolean;


  constructor(private fb: FormBuilder, private authService: AuthenticationService, store: Store<IAppState>) {
    super();

    this.disposeOnDestroy(store.select((state: IAppState)=> state.user).subscribe(value => {
      this.user = value;
      if(this.user != null) {
        this.isLecturerInfoVisible = this.user.type === UserType.LECTURER;
        this.resetFormValue(value);
      }
    }));
  }

  ngOnInit() {

    this.lecturerInformationGrp = this.fb.group({
      university: ['', Validators.required],
      academicPosition: ['', Validators.required]
    });

    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      lastName: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      email: ['', Validators.compose([Validators.required, EmailValidators.normal])],
      lecturerInformation: this.lecturerInformationGrp
    });

    this.resetFormValue(this.user);

    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', Validators.compose([Validators.required])],
      newPasswords: this.fb.group({
        newPassword: ['', Validators.compose([Validators.required, UniversalValidators.noWhitespace, Validators.minLength(8)])],
        newPasswordConfirmation: ['', Validators.compose([Validators.required])],
      })
    });

    this.passwordChangeForm.controls['newPasswords'].setValidators(PasswordValidators.mismatchedPasswords('newPassword', 'newPasswordConfirmation'));

  }

  private resetFormValue(user: User): void {
    if(!user || !this.editProfileForm || !this.lecturerInformationGrp) {
      console.log('returning');
      return;
    }
    if(this.isLecturerInfoVisible) {
      this.lecturerInformationGrp.patchValue({
        university: user.university,
        academicPosition: user.position
      });
      this.lecturerInformationGrp.enable();
    } else {
      this.lecturerInformationGrp.disable();
    }

    this.editProfileForm.patchValue({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    });
  }

  public reset(event): void {
    event.preventDefault();
    this.resetFormValue(this.user);
  }

  public onUpdateSubmit(): void {
    if(!this.editProfileForm.valid) {
      return;
    }

    let newValues = {};

    newValues["id"] = this.user.id;
    newValues["first_name"] = this.editProfileForm.get('firstName').value;
    newValues["last_name"] = this.editProfileForm.get('lastName').value;
    newValues["email"] = this.editProfileForm.get('email').value;

    if(this.isLecturerInfoVisible) {
      newValues["university"] = this.lecturerInformationGrp.get('university').value;
      newValues["position"] = this.lecturerInformationGrp.get('academicPosition').value;
    }

    this.authService.updateUser(newValues);
  }

  public onPasswordSubmit(): void {
    if(!this.passwordChangeForm.valid) {
      return;
    }

    let newValues = {};

    newValues['id'] = this.user.id;
    newValues['current_password'] = this.passwordChangeForm.get('currentPassword').value;
    newValues['password'] = this.passwordChangeForm.get('newPasswords.newPassword').value;
    newValues['password_confirmation'] = this.passwordChangeForm.get('newPasswords.newPasswordConfirmation').value;

    this.authService.changePassword(newValues);
  }

}
