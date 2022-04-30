import { createReducer, on } from '@ngrx/store';
import { createNewBoard } from './actions';
import { initialBoardsState } from './state.model';

export const boardsReducer = createReducer(
  initialBoardsState,
  on(createNewBoard, (state, { board }) => ({
    ...state,
    boards: [...board],
  })),
);
