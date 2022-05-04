import { createReducer, on } from '@ngrx/store';
import {
  createNewBoard,
  getAllBoards,
  getAllBoardsFailed,
  getAllBoardsSuccessfully,
  deleteBoard,
} from '../actions/board.actions';
import { initialBoardsState } from '../state.model';

export const boardsReducer = createReducer(
  initialBoardsState,
  on(createNewBoard, (state, { board }) => {
    if (!state.boards) state.boards = [];
    return {
      ...state,
      boards: [...state.boards, board],
    };
  }),
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
  on(deleteBoard, (state, { id }) => {
    if (!state.boards) state.boards = [];
    return { ...state, boards: [...state.boards.filter((board) => board.id !== id)] };
  }),
);
