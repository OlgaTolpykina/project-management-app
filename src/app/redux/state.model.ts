import { Board } from '@shared/types/board.model';

export interface AppState {
  boards: BoardsState;
  selectedBoard: SelectedBoardState;
}

interface BoardsState {
  boards: Board[] | undefined;
}

export const initialBoardsState: BoardsState = {
  boards: undefined,
};

export interface SelectedBoardState {
  selectedBoard: Board | undefined;
  selectedBoardId: string;
}

export const initialSelectedBoardState: SelectedBoardState = {
  selectedBoard: undefined,
  selectedBoardId: '',
};
