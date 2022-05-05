import { AppState } from '../state.model';

export const selectColumns = (state: AppState) => state.columns.columns;
