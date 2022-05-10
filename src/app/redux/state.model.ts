import { Board } from '@shared/types/board.model';
import { Column } from '@shared/types/column.model';
import { User } from '@shared/types/user.model';

export interface AppState {
  boards: BoardsState;
  selectedBoard: SelectedBoardState;
  users: UsersState;
}

interface BoardsState {
  boards: Board[] | undefined;
}

export const initialBoardsState: BoardsState = {
  boards: undefined,
};

export interface BoardState {
  id: string;
  title: string;
  columns?: Column[];
}

export const initialBoardState: BoardState = {
  id: '',
  title: '',
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

export interface UsersState {
  users: User[] | undefined;
}

export const initialUserState: UsersState = {
  users: undefined,
};
