import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '@app/constants';
import { Board } from '@shared/types/board.model';
import { Error } from '@shared/types/error.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  url = `${BASE_URL}/boards`;

  constructor(private http: HttpClient) {}

  getAllBoards(): Observable<Board[] | Error> {
    return this.http.get<Board[] | Error>(this.url);
  }

  createBoard(body: { title: string }): Observable<Board | Error> {
    return this.http.post<Board | Error>(this.url, body);
  }

  deleteBoardById(boardId: string): void {
    this.http.delete(`${this.url}/${boardId}`);
  }

  updateBoard(boardId: string, body: { title: string }): Observable<Board | Error> {
    return this.http.put<Board | Error>(`${this.url}/${boardId}`, body);
  }
}
