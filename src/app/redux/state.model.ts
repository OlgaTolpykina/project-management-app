import { Board } from '@shared/types/board.model';

export interface AppState {
  boards: BoardsState;
  selectedBoard: SelectedBoardState;
}

interface BoardsState {
  boards: Board[];
}

export const initialBoardsState: BoardsState = {
  boards: [],
};

export interface SelectedBoardState {
  selectedBoard: Board | undefined;
  selectedBoardId: string;
}

export const initialSelectedBoardState: SelectedBoardState = {
  selectedBoard: undefined,
  selectedBoardId: '',
};
