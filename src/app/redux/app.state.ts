import { boardsReducer, selectedBoardReducer } from './reducers/board.reducers';
import { usersReducer } from './reducers/user.reducers';

export const appState = {
  boards: boardsReducer,
  selectedBoard: selectedBoardReducer,
  users: usersReducer,
};
