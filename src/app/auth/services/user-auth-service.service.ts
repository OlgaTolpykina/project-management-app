import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserSettings } from '../models/user-settings.model';
import { BeAuthService } from '../../shared/services/be-auth.service';
import { UserService } from '../../shared/services/user.service';

import { Error } from '@shared/types/error.model';
import { User } from '@shared/types/user.model';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(beAuthService: BeAuthService, userService: UserService, private router: Router) {
    this.beAuthService = beAuthService;
    this.userService = userService;
  }

  getIsAuthorizedStatus(): void {
    this.isAuthorized = localStorage.getItem('isAuthorized')
      ? (localStorage.getItem('isAuthorized') as string)
      : 'false';
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

  saveLocalUser(user: UserSettings) {
    localStorage.setItem('savedUser', JSON.stringify(user));
    localStorage.setItem('token', user.userAuthToken);
  }

  registryUser(user: UserSettings) {
    const newUser: UserSettings = user;
    this.beAuthService
      .signup({ login: newUser.login, password: newUser.userPassword, name: newUser.userName })
      .pipe(catchError(this.handleError))
      .subscribe(async (data: User | Error) => {
        if (!(data instanceof Error)) {
          this.loadedUser = { ...data } as User;
          newUser.id = this.loadedUser.id as string;
          this.userSettings.id = this.loadedUser.id as string;
          this.saveLocalUser(newUser);
          await this.authorizeUser(newUser);
        } else console.log(data);
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
      .pipe(catchError(this.handleError))
      .subscribe(async (data: User | Error) => {
        if (!(data instanceof Error)) {
          this.loadedUser = { ...data } as User;
          newUser.id = this.loadedUser.id as string;
          this.userSettings.id = this.loadedUser.id as string;
          this.saveLocalUser(newUser);
          // await this.authorizeUser(newUser);
        } else console.log(data);
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
          .pipe(catchError(this.handleError))
          .subscribe((data: { token: string } | Error) => {
            if (!(data instanceof Error)) {
              this.userSettings.userAuthToken = (data as { token: string }).token;
              this.saveLocalUser(this.userSettings);
              this.logInOutUser('true');
              localStorage.setItem('isAuthorized', 'true');
              this.changeUserSource.next(newUser.userName);
              this.isUserAuthorized.next(true);
            }
          });
      }
    }
  }

  deleteUser() {
    this.userService
      .deleteUser(this.getSavedLocalUser()?.id as string)
      .pipe(catchError(this.handleError))
      .subscribe(async (data) => {
        if (!(data instanceof Error)) {
          this.logInOutUser('false');
          localStorage.removeItem('savedUser');
          localStorage.removeItem('token');
          this.router.navigate(['home']);
        }
      });
  }

  logInOutUser(status: string) {
    localStorage.setItem('isAuthorized', status);
    this.isAuthorized = status;
    const userStatus: boolean = status as unknown as boolean;
    this.isUserAuthorized.next(userStatus);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
