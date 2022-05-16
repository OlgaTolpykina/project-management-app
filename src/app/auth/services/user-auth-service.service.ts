import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserSettings } from '../models/user-settings.model';
import { BeAuthService } from '../../shared/services/be-auth.service';
import { UserService } from '../../shared/services/user.service';

import { Error } from '@shared/types/error.model';
import { User } from '@shared/types/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagePageComponent } from '@auth/components/message-page/message-page.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class UserAuthServiceService {
  public userSettings: UserSettings = {
    login: '',
    userName: '',
    userPassword: '',
    userAuthToken: '',
  };

  messageForUser: string = '';

  redirectUrl: string | null = null;

  loadedUser: User = {
    name: '',
    login: '',
    password: '',
  };

  public isAuthorized: string = 'false';

  private changeUserSource = new Subject<string>();

  private isUserAuthorized = new Subject<boolean>();

  changeUser$ = this.changeUserSource.asObservable();

  isUserAuthorized$ = this.isUserAuthorized.asObservable();

  beAuthService: BeAuthService;

  userService: UserService;

  constructor(
    beAuthService: BeAuthService,
    userService: UserService,
    public router: Router,
    private dialog: MatDialog,
  ) {
    this.beAuthService = beAuthService;
    this.userService = userService;
  }

  getIsAuthorizedStatus(): void {
    this.isAuthorized = localStorage.getItem('isAuthorized')
      ? (localStorage.getItem('isAuthorized') as string)
      : 'false';
    if (this.isAuthorized === 'true') {
      this.userService
        .getAllUsers()
        .pipe(catchError((error) => this.handleError(error)))
        .subscribe();
    }
    this.userSettings.userName =
      this.isAuthorized === 'true' ? (this.getSavedLocalUser()?.userName as string) : '';
    this.userSettings.userAuthToken =
      this.isAuthorized === 'true' ? (this.getSavedLocalUser()?.userAuthToken as string) : '';
    this.logInOutUser(this.isAuthorized);
  }

  getSavedLocalUser(): UserSettings | null {
    if (localStorage.getItem('savedUser')) {
      const savedLocalUser: UserSettings = JSON.parse(
        localStorage.getItem('savedUser') as string,
      ) as UserSettings;
      return savedLocalUser;
    }
    return null;
  }

  private async saveLocalUser(user: UserSettings) {
    localStorage.setItem('savedUser', JSON.stringify(user));
    localStorage.setItem('token', user.userAuthToken);
  }

  registryUser(user: UserSettings) {
    const newUser: UserSettings = user;
    this.beAuthService
      .signup({ login: newUser.login, password: newUser.userPassword, name: newUser.userName })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(async (data: User | Error) => {
        if (!(data instanceof Error)) {
          this.loadedUser = { ...data } as User;
          newUser.id = this.loadedUser.id as string;
          this.userSettings.id = this.loadedUser.id as string;
          this.saveLocalUser(newUser);
          this.getMessageForUser('register profile', 'home');
          await this.authorizeUser(this.userSettings);
        }
      });
  }

  updateUser(user: UserSettings) {
    const newUser: UserSettings = user;
    this.userService
      .updateUser(user.id as string, {
        name: newUser.userName,
        login: newUser.login,
        password: newUser.userPassword,
      })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(async (data: User | Error) => {
        if (!(data instanceof Error)) {
          this.loadedUser = { ...data } as User;
          newUser.id = this.loadedUser.id as string;
          this.userSettings.id = this.loadedUser.id as string;
          newUser.userPassword = '';
          this.saveLocalUser(newUser);
          const url: string = this.redirectUrl ? this.redirectUrl : 'home';
          this.getMessageForUser('update profile', url);
        }
      });
  }

  private async getUserData(login: string): Promise<void> {
    this.userService
      .getAllUsers()
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(async (data: User[] | Error) => {
        if (!(data instanceof Error)) {
          const users: User[] = JSON.parse(JSON.stringify(data));
          const currentUser: User = users.filter((item) => {
            return item.login === login;
          })[0];
          this.userSettings.id = currentUser.id;
          this.userSettings.userName = currentUser.name as string;
          await this.saveLocalUser(this.userSettings);
        }
      });
  }

  async authorizeUser(user: UserSettings) {
    this.userSettings = user;
    let newUser: UserSettings = user;
    const localSavedUser: UserSettings | null = this.getSavedLocalUser();
    if (localSavedUser) {
      if (newUser.login === localSavedUser.login) {
        newUser = localSavedUser;
        this.beAuthService
          .signin({ login: newUser.login, password: newUser.userPassword })
          .pipe(catchError((error) => this.handleError(error)))
          .subscribe((data: { token: string } | Error) => {
            if (!(data instanceof Error)) {
              this.userSettings.userAuthToken = (data as { token: string }).token;
              this.userSettings.userPassword = '';
              this.saveLocalUser(this.userSettings);
              this.logInOutUser('true');
              localStorage.setItem('isAuthorized', 'true');
              this.changeUserSource.next(newUser.userName);
              this.isUserAuthorized.next(true);
              const url: string =
                this.redirectUrl && !this.redirectUrl.includes('auth')
                  ? (this.redirectUrl as string)
                  : 'main';
              this.getMessageForUser('Welcome in profile', url);
              this.logInOutUser('true');
            }
          });
      }
    } else {
      this.beAuthService
        .signin({ login: newUser.login, password: newUser.userPassword })
        .pipe(catchError((error) => this.handleError(error)))
        .subscribe(async (data: { token: string } | Error) => {
          if (!(data instanceof Error)) {
            this.userSettings.userAuthToken = (data as { token: string }).token;
            this.userSettings.userPassword = '';
            await this.saveLocalUser(this.userSettings);
            await this.getUserData(newUser.login);
            await this.saveLocalUser(this.userSettings);
            await this.logInOutUser('true');
            this.changeUserSource.next(newUser.userName);
            this.isUserAuthorized.next(true);
            const url: string =
              this.redirectUrl && !this.redirectUrl.includes('auth')
                ? (this.redirectUrl as string)
                : 'main';
            this.getMessageForUser('Welcome in profile', url);
          }
        });
    }
  }

  deleteUser() {
    this.userService
      .deleteUser(this.getSavedLocalUser()?.id as string)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(async (data) => {
        if (!(data instanceof Error)) {
          this.logInOutUser('false');
          localStorage.removeItem('savedUser');
          localStorage.removeItem('token');
          this.getMessageForUser('delete profile', 'home');
        }
      });
  }

  async logInOutUser(status: string) {
    localStorage.setItem('isAuthorized', status);
    this.isAuthorized = status;
    const userStatus: boolean = status === 'true' ? true : false;
    if (!userStatus) {
      localStorage.removeItem('savedUser');
      localStorage.removeItem('token');
    }
    this.isUserAuthorized.next(userStatus);
  }

  getMessageForUser(message: string, redirectUrl?: string | null) {
    this.messageForUser = message;
    const backingUrl = this.redirectUrl ? this.redirectUrl : 'main';
    const url = redirectUrl ? redirectUrl : backingUrl;
    this.openDialog();
    this.router.navigate([url]);
    setTimeout(() => {
      this.dialog.closeAll();
      // this.router.navigate([url]);
    }, 3000);
  }

  openDialog(): void {
    this.dialog.open(MessagePageComponent, {
      height: '300px',
      width: '300px',
    });
  }

  handleError(error: HttpErrorResponse) {
    if (error.error.statusCode === 0) {
      console.log('An error occurred:', error.error);
    } else {
      console.log(
        `Backend returned code ${error.error.statusCode}, body was: `,
        error.error.message,
      );
      switch (error.error.statusCode) {
        case 404:
          this.getMessageForUser('signUp first');
          break;
        case 409:
          this.getMessageForUser(`user exist`);
          break;
        case 403:
          this.getMessageForUser('login&password not found');
          break;
        case 401:
          this.getMessageForUser('Unauthorized', 'auth/login');
          break;
        default:
          this.getMessageForUser(error.error?.message as string);
          break;
      }
    }
    return throwError(() => {
      new Error('Something bad happened; please try again later.');
    });
  }
}
