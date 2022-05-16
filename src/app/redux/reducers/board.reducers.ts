import { createReducer, on } from '@ngrx/store';
import { Column } from '@shared/types/column.model';
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
    let updatedColumns: Column[] = [];
    if (selectedBoard.columns) {
      selectedBoard.columns.forEach((column) => {
        if (column.tasks?.length) {
          column = {
            ...column,
            tasks: [...column.tasks].sort((a, b) => (a.order > b.order ? 1 : -1)),
          };
          updatedColumns.push(column);
        } else {
          updatedColumns.push(column);
        }
      });
      updatedColumns = [...updatedColumns].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return { ...state, selectedBoard: { ...selectedBoard, columns: updatedColumns } };
  }),
  on(getSelectedBoardFailed, (state, { error }) => ({
    ...state,
    error,
  })),
  on(clearSelectedBoard, (state) => {
    return { ...state, selectedBoard: undefined };
  }),
);
