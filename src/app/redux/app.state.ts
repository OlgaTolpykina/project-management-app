import { boardsReducer, selectedBoardReducer } from './reducers/board.reducers';

export const appState = {
  boards: boardsReducer,
  selectedBoard: selectedBoardReducer,
};
