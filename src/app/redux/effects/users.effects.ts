import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '@shared/services/user.service';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { getAllUsers, getAllUsersSuccessfully, getAllUsersFailed } from '../actions/users.actions';

@Injectable({ providedIn: 'any' })
export class UsersEffects {
  constructor(private actions: Actions, private userService: UserService) {}

  getUsers: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(getAllUsers),
      switchMap(() =>
        this.userService.getAllUsers().pipe(
          map((users) => getAllUsersSuccessfully({ users })),
          catchError((error) => of(getAllUsersFailed({ error }))),
        ),
      ),
    ),
  );
}
