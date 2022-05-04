import { Board } from '@shared/types/board.model';

export interface AppState {
  boards: BoardsState;
}

interface BoardsState {
  boards: Board[] | undefined;
}

export const initialBoardsState: BoardsState = {
  boards: undefined,
};
