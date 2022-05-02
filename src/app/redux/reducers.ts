import { createReducer, on } from '@ngrx/store';
import {
  createNewBoard,
  getAllBoards,
  getAllBoardsFailed,
  getAllBoardsSuccessfully,
} from './actions';
import { initialBoardsState } from './state.model';

export const boardsReducer = createReducer(
  initialBoardsState,
  on(createNewBoard, (state, { board }) => ({
    ...state,
    boards: [...state.boards, board],
  })),
  on(getAllBoards, (state) => {
    return { ...state };
  }),
  on(getAllBoardsSuccessfully, (state, { boards }) => {
    return { ...state, boards };
  }),
  on(getAllBoardsFailed, (state, { error }) => ({
    ...state,
    error,
  })),
);
