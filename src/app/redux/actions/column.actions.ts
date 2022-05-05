import { createAction, props } from '@ngrx/store';
import { Column } from '@shared/types/column.model';

export const createNewColumn = createAction(
  '[COLUMNS] CREATE NEW COLUMN',
  props<{ column: Column }>(),
);

export const getAllColumns = createAction('[COLUMNS] GET ALL COLUMNS');

export const getAllColumnsSuccessfully = createAction(
  '[COLUMNS] GET ALL COLUMNS SUCCESSFULLY',
  props<{ columns: Column[] }>(),
);

export const getAllColumnsFailed = createAction(
  '[COLUMNS] GET ALL COLUMNS FAILED',
  props<{ error: Error }>(),
);

export const deleteColumn = createAction('[COLUMNS] DELETE COLUMN', props<{ id: string }>());
