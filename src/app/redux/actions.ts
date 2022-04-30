import { createAction, props } from '@ngrx/store';
import { Board } from '@shared/types/board.model';

export const createNewBoard = createAction('[BOARDS] CREATE NEW BOARD', props<{ board: Board }>());
