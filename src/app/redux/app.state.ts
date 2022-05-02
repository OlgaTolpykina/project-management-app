import { boardsReducer, selectedBoardReducer } from './reducers';

export const appState = {
  boards: boardsReducer,
  selectedBoard: selectedBoardReducer,
};
