import { boardsReducer, selectedBoardReducer } from './reducers/board.reducers';
import { columnsReducer } from './reducers/column.reducers';

export const appState = {
  boards: boardsReducer,
  selectedBoard: selectedBoardReducer,
  columns: columnsReducer,
};
