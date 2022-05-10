import { createAction, props } from '@ngrx/store';
import { User } from '@shared/types/user.model';

export const getAllUsers = createAction('[USERS] GET ALL USERS');

export const getAllUsersSuccessfully = createAction(
  '[USERS] GET ALL USERS SUCCESSFULLY',
  props<{ users: User[] }>(),
);

export const getAllUsersFailed = createAction(
  '[USERS] GET ALL USERS FAILED',
  props<{ error: Error }>(),
);
