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
} from './actions';
import { initialBoardsState, initialSelectedBoardState } from './state.model';

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
);
