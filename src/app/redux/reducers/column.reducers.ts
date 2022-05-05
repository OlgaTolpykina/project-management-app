import { createReducer, on } from '@ngrx/store';
import { initialColumnsState } from '../state.model';
import {
  createNewColumn,
  deleteColumn,
  getAllColumns,
  getAllColumnsFailed,
  getAllColumnsSuccessfully,
} from '../actions/column.actions';

export const columnsReducer = createReducer(
  initialColumnsState,
  on(createNewColumn, (state, { column }) => {
    // if (!state.columns) state.columns = [];
    return {
      ...state,
      columns: [...state.columns, column],
    };
  }),
  on(getAllColumns, (state) => {
    return { ...state };
  }),
  on(getAllColumnsSuccessfully, (state, { columns }) => {
    return { ...state, columns };
  }),
  on(getAllColumnsFailed, (state, { error }) => ({
    ...state,
    error,
  })),
  on(deleteColumn, (state, { id }) => {
    if (!state.columns) state.columns = [];
    return { ...state, boards: [...state.columns.filter((column) => column.id !== id)] };
  }),
);
