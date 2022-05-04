import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';

import { UserSettings } from '../../models/user-settings.model';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { MyErrorStateMatcher } from '../../services/error-state.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  userSettings: UserSettings = {
    login: '',
    userName: '',
    userPassword: '',
    userAuthToken: '',
  };

  matcher = new MyErrorStateMatcher();

  authService: UserAuthServiceService;

  constructor(authService: UserAuthServiceService, private router: Router) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.authService.logInOutUser('false');
    const savedUser: UserSettings | null = this.authService.getSavedLocalUser();
    this.userSettings.login = savedUser?.login as string;
    this.userSettings.id = savedUser?.id as string;
    this.userSettings.userName = savedUser?.userName as string;
    this.userSettings.userAuthToken = savedUser?.userAuthToken as string;
    this.authorizeForm.controls['loginFormControl'].setValue(this.userSettings.login);
  }

  public showPassword: boolean = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private passwordMatchingValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;
      if (!value) {
        return null;
      }
      if (this.authService.getSavedLocalUser()) {
        const validPassword =
          value === (this.authService.getSavedLocalUser()?.userPassword as string);
        return !validPassword ? { passwordMatch: true } : null;
      } else {
        const validPassword = true;
        return !validPassword ? { passwordMatch: true } : null;
      }
    };
  }

  public authorizeForm: FormGroup = new FormGroup({
    loginFormControl: new FormControl('', [Validators.required]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.validatePasswordStrength(),
      // this.passwordMatchingValidator(),
    ]),
  });

  private validatePasswordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;
      if (!value) {
        return null;
      }
      const upperCaseCheck = /[A-Z]+/.test(value);
      const lowerCaseCheck = /[a-z]+/.test(value);
      const numericCheck = /[0-9]+/.test(value);
      const validPassword = upperCaseCheck && lowerCaseCheck && numericCheck;
      return !validPassword ? { passwordStrength: true } : null;
    };
  }

  public getUserSettings() {
    this.userSettings.login = this.authorizeForm.controls['loginFormControl'].value;
    this.userSettings.userPassword = this.authorizeForm.controls['passwordFormControl'].value;
    this.authService.userSettings = this.userSettings;
  }

  async authorizeUserSettings() {
    this.getUserSettings();
    if (this.userSettings.login === this.authService.getSavedLocalUser()?.login) {
      if (this.authorizeForm.status === 'VALID') {
        this.authService.authorizeUser(this.userSettings);
      }
    } else {
      localStorage.removeItem('savedUser');
      localStorage.removeItem('token');
      if (this.authorizeForm.status === 'VALID') {
        this.authService.authorizeUser(this.userSettings);
      }
    }
  }
}
