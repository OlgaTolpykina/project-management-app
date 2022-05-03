import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';
import { Board } from '@shared/types/board.model';
import { Error } from '@shared/types/error.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  url = `${environment.BASE_URL}/boards`;

  constructor(private http: HttpClient) {}

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.url);
  }

  createBoard(body: { title: string }): Observable<Board | Error> {
    return this.http.post<Board | Error>(this.url, body);
  }

  getBoardById(boardId: string): Observable<Board> {
    return this.http.get<Board>(`${this.url}/${boardId}`);
  }

  deleteBoardById(boardId: string): Observable<any> {
    return this.http.delete(`${this.url}/${boardId}`);
  }

  updateBoard(boardId: string, body: { title: string }): Observable<Board | Error> {
    return this.http.put<Board | Error>(`${this.url}/${boardId}`, body);
  }
}
