import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { UserSettings } from '../models/user-settings.model';
import { BeAuthService } from '../../shared/services/be-auth.service';

import { Error } from '@shared/types/error.model';
import { User } from '@shared/types/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserAuthServiceService {
  public userSettings: UserSettings = {
    id: '',
    login: '',
    userName: '',
    userPassword: '',
    userAuthToken: '',
  };

  redirectUrl: string | null = null;

  loadedUser: User = {
    id: '',
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

  constructor(beAuthService: BeAuthService) {
    this.beAuthService = beAuthService;
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
  }

  registryUser(user: UserSettings) {
    const newUser: UserSettings = user;
    this.beAuthService
      .signup({ login: newUser.login, password: newUser.userPassword, name: newUser.userName })
      .pipe(catchError(this.handleError))
      .subscribe(async (data: User | Error) => {
        if (!(data instanceof Error)) {
          console.log(data);
          this.loadedUser = { ...data } as User;
          newUser.id = this.loadedUser.id as string;
          this.userSettings.id = this.loadedUser.id as string;
          this.saveLocalUser(newUser);
          await this.authorizeUser(newUser);
        } else console.log(data);
      });
  }

  getUserAuthToken(user: UserSettings): string {
    const newUser: UserSettings = user;
    newUser.userAuthToken = 'AIzaSyDymexQ-mAOw13v6xGt4nDgQk9RavcQs4s';
    const token = 'AIzaSyDymexQ-mAOw13v6xGt4nDgQk9RavcQs4s';
    return token;
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
            console.log(data);
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
