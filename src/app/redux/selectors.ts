import { createSelector } from '@ngrx/store';
import { AppState, SelectedBoardState } from './state.model';

export const selectBoards = (state: AppState) => state.boards.boards;

export const selectSelectedBoardState = (state: AppState) => state.selectedBoard;

export const selectSelectedBoard = createSelector(
  selectSelectedBoardState,
  (state: SelectedBoardState) => state.selectedBoard,
);

export const selectSelectedBoardTitle = createSelector(
  selectSelectedBoardState,
  (state: SelectedBoardState) => state.selectedBoard?.title,
);

export const selectSelectedBoardId = createSelector(
  selectSelectedBoardState,
  (state: SelectedBoardState) => state.selectedBoardId,
);
