import { createReducer, on } from '@ngrx/store';
import {
  createNewBoard,
  getAllBoards,
  getAllBoardsFailed,
  getAllBoardsSuccessfully,
  getSelectedBoard,
  getSelectedBoardFailed,
  getSelectedBoardSuccessfully,
  setSelectedBoard,
  setSelectedBoardId,
  deleteBoard,
  clearSelectedBoard,
} from '../actions/board.actions';
import { initialBoardsState, initialSelectedBoardState } from '../state.model';

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

export const selectedBoardReducer = createReducer(
  initialSelectedBoardState,
  on(setSelectedBoardId, (state, { selectedBoardId }) => ({
    ...state,
    selectedBoardId: selectedBoardId,
  })),
  on(setSelectedBoard, (state, { selectedBoard }) => ({
    ...state,
    selectedBoard: selectedBoard,
  })),
  on(getSelectedBoard, (state) => {
    return { ...state };
  }),
  on(getSelectedBoardSuccessfully, (state, { selectedBoard }) => {
    return { ...state, selectedBoard: selectedBoard };
  }),
  on(getSelectedBoardFailed, (state, { error }) => ({
    ...state,
    error,
  })),
  on(clearSelectedBoard, (state) => {
    return { ...state, selectedBoard: undefined };
  }),
);
