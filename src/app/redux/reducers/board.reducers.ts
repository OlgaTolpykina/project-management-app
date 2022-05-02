import { createReducer, on } from '@ngrx/store';
import {
  createNewBoard,
  getAllBoards,
  getAllBoardsFailed,
  getAllBoardsSuccessfully,
  deleteBoard,
} from '../actions/board.actions';
import { Board } from '@shared/types/board.model';

const initialState: Board[] = [];

export const boardsReducer = createReducer(
  initialState,
  on(createNewBoard, (state, { board }) => {
    return [...state, board];
  }),
  on(getAllBoards, (state) => {
    return [...state];
  }),
  on(getAllBoardsSuccessfully, (state, { boards }) => {
    return [...boards];
  }),
  on(getAllBoardsFailed, (state, { error }) => ({
    ...state,
    error,
  })),
  on(deleteBoard, (state, { id }) => {
    return [...state].filter((board) => board.id !== id);
  }),
);
