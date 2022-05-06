import { createAction, props } from '@ngrx/store';
import { Board } from '@shared/types/board.model';

export const createNewBoard = createAction('[BOARDS] CREATE NEW BOARD', props<{ board: Board }>());

export const getAllBoards = createAction('[BOARDS] GET ALL BOARDS');

export const getAllBoardsSuccessfully = createAction(
  '[BOARDS] GET ALL BOARDS SUCCESSFULLY',
  props<{ boards: Board[] }>(),
);

export const getAllBoardsFailed = createAction(
  '[BOARDS] GET ALL BOARDS FAILED',
  props<{ error: Error }>(),
);

export const deleteBoard = createAction('[BOARDS] DELETE BOARD', props<{ id: string }>());

export const setSelectedBoard = createAction(
  '[SELECTED BOARD] SET SELECTED BOARD',
  props<{ selectedBoard: Board }>(),
);

export const clearSelectedBoard = createAction('[SELECTED BOARD] CLEAR SELECTED BOARD');

export const setSelectedBoardId = createAction(
  '[SELECTED BOARD] SET SELECTED BOARD ID',
  props<{ selectedBoardId: string }>(),
);

export const getSelectedBoard = createAction('[SELECTED BOARD PAGE] GET BOARD BY ID');

export const getSelectedBoardSuccessfully = createAction(
  '[SELECTED BOARD EFFECT] GET BOARD BY ID SUCCESSFULLY',
  props<{ selectedBoard: Board }>(),
);

export const getSelectedBoardFailed = createAction(
  '[SELECTED BOARD EFFECT] GET BOARD BY ID FAILED',
  props<{ error: Error }>(),
);
