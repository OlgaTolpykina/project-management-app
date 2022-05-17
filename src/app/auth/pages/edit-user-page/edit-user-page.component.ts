import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserSettings } from '../../models/user-settings.model';
import { UserAuthServiceService } from '../../services/user-auth-service.service';
import { MyErrorStateMatcher } from '../../services/error-state.service';
import { MatDialog } from '@angular/material/dialog';
import { MessagePageComponent } from '@auth/components/message-page/message-page.component';
import { RouteService } from '@core/services/route.service';

@Component({
  selector: 'app-edit-user-page',
  templateUrl: './edit-user-page.component.html',
  styleUrls: ['./edit-user-page.component.scss'],
})
export class EditUserPageComponent implements OnInit {
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
    private dialog: MatDialog,
    private route: RouteService,
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.userSettings =
      this.authService.getSavedLocalUser() !== null
        ? (this.authService.getSavedLocalUser() as UserSettings)
        : this.authService.userSettings;
    this.registryFormGroup.controls['loginFormControl'].setValue(this.userSettings.login);
    this.registryFormGroup.controls['nameFormControl'].setValue(this.userSettings.userName);
    this.registryFormGroup.controls['passwordFormControl'].setValue(this.userSettings.userPassword);
    this.route.getRoute();
  }

  public showPassword: boolean = false;

  public togglePasswordVisibility(e: Event): void {
    e.stopPropagation();
    this.showPassword = !this.showPassword;
  }

  public showConfirmPassword: boolean = false;

  public toggleConfirmPasswordVisibility(e: Event): void {
    e.stopPropagation();
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  registryFormGroup: FormGroup = new FormGroup({
    loginFormControl: new FormControl('', [Validators.required]),
    nameFormControl: new FormControl('', [Validators.required, Validators.minLength(4)]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.validatePasswordStrength(),
    ]),
    passwordDuplicateFormControl: new FormControl('', [
      Validators.required,
      this.passwordMatchingValidator(),
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

  private passwordMatchingValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;
      if (!value) {
        return null;
      }
      const validPassword =
        value === (this.registryFormGroup.controls['passwordFormControl'].value as string);
      return !validPassword ? { passwordMatch: true } : null;
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
      this.authService.updateUser(this.userSettings);
    }
  }

  openDialog(): void {
    this.dialog.open(MessagePageComponent, {
      height: '300px',
      width: '300px',
    });
  }
}
