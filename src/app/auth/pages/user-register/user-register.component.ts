/* eslint-disable max-classes-per-file */
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';

import { Router } from '@angular/router';
import { UserSettings } from '../../models/user-settings.model';
import { UserAuthServiceService } from '../../services/user-auth-service.service';
import { MyErrorStateMatcher } from '../../services/error-state.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
})
export class UserRegisterComponent implements OnInit {
  activeLang: string = 'en';

  userSettings: UserSettings = {
    id: '',
    login: '',
    userName: '',
    userPassword: '',
    userAuthToken: '',
  };

  authService: UserAuthServiceService;

  constructor(
    authService: UserAuthServiceService,
    private router: Router,
    private transloco: TranslocoService,
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
    this.userSettings = this.authService.userSettings;
    this.registryFormGroup.controls['loginFormControl'].setValue(this.userSettings.login);
  }

  registryFormGroup: FormGroup = new FormGroup({
    loginFormControl: new FormControl('', [Validators.required, Validators.minLength(8)]),
    nameFormControl: new FormControl('', [Validators.required, Validators.minLength(4)]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.validatePasswordStrength(),
    ]),
  });

  matcher = new MyErrorStateMatcher();

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

  getUserSettings() {
    this.userSettings.userName = this.registryFormGroup.controls['nameFormControl'].value;
    this.userSettings.userPassword = this.registryFormGroup.controls['passwordFormControl'].value;
    this.userSettings.login = this.registryFormGroup.controls['loginFormControl'].value;
  }

  getRegistry() {
    this.getUserSettings();
    if (this.registryFormGroup.status === 'VALID') {
      this.authService.registryUser(this.userSettings);
      this.router.navigate(['home']);
    }
  }
}
