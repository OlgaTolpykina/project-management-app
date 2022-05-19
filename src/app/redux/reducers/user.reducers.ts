import { createReducer, on } from '@ngrx/store';
import { initialUserState } from '../state.model';
import { getAllUsers, getAllUsersSuccessfully, getAllUsersFailed } from '../actions/users.actions';

export const usersReducer = createReducer(
  initialUserState,
  on(getAllUsers, (state) => {
    return { ...state };
  }),
  on(getAllUsersSuccessfully, (state, { users }) => {
    return { ...state, users };
  }),
  on(getAllUsersFailed, (state, { error }) => ({
    ...state,
    error,
  })),
);
