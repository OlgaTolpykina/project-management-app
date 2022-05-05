import { Board } from '@shared/types/board.model';
import { Column } from '@shared/types/column.model';

export interface AppState {
  boards: BoardsState;
  selectedBoard: SelectedBoardState;
  columns: ColumnsState;
}

interface BoardsState {
  boards: Board[] | undefined;
}

export const initialBoardsState: BoardsState = {
  boards: undefined,
};

interface ColumnsState {
  columns: Column[];
}

export const initialColumnsState: ColumnsState = {
  columns: [],
};

export interface SelectedBoardState {
  selectedBoard: Board | undefined;
  selectedBoardId: string;
}

export const initialSelectedBoardState: SelectedBoardState = {
  selectedBoard: undefined,
  selectedBoardId: '',
};
