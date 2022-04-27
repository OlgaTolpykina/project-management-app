import {
  Component,
  OnInit,
  // Output,
  // Input
} from '@angular/core';
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
import { UserAuthServiceService } from '../../services/user-auth-service.service';
import { MyErrorStateMatcher } from '../../services/error-state.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  userSettings: UserSettings = {
    userName: '',
    userPassword: '',
    userAuthToken: '',
    userMail: '',
    userLastName: '',
  };

  matcher = new MyErrorStateMatcher();

  authService: UserAuthServiceService;

  constructor(authService: UserAuthServiceService, private router: Router) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.authService.logInOutUser('false');
    const savedUser: UserSettings | null = this.authService.getSavedLocalUser();
    this.userSettings.userMail = savedUser?.userMail as string;
    this.authorizeForm.controls['emailFormControl'].setValue(this.userSettings.userMail);
  }

  private passwordMatchingValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;
      if (!value) {
        return null;
      }
      const validPassword =
        value === (this.authService.getSavedLocalUser()?.userPassword as string);
      return !validPassword ? { passwordMatch: true } : null;
    };
  }

  public authorizeForm: FormGroup = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.validatePasswordStrength(),
      this.passwordMatchingValidator(),
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
    this.userSettings.userMail = this.authorizeForm.controls['emailFormControl'].value;
    this.userSettings.userPassword = this.authorizeForm.controls['passwordFormControl'].value;
    this.authorizeUserSettings();
  }

  private async authorizeUserSettings() {
    if (this.userSettings.userMail === this.authService.getSavedLocalUser()?.userMail) {
      if (this.authorizeForm.status === 'VALID') {
        await this.authService.authorizeUser(this.userSettings);
        this.router.navigate(['home']);
      }
    } else {
      this.authService.userSettings = this.userSettings;
      // this.authorizeForm.controls['nameFormControl'].setValue('');
      // this.authorizeForm.controls['passwordFormControl'].setValue('');
      this.router.navigate(['/register']);
    }
  }
}
