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
