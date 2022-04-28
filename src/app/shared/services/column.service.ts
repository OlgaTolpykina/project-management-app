import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '@app/constants';
import { Column } from '@shared/types/column.model';
import { Error } from '@shared/types/error.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  url = `${BASE_URL}/boards`;

  constructor(private http: HttpClient) {}

  generateUrl(boardId: string): string {
    return `${this.url}/${boardId}`;
  }

  getAllColumns(boardId: string): Observable<Column[] | Error> {
    return this.http.get<Column[] | Error>(`${this.generateUrl(boardId)}/columns`);
  }

  createColumn(boardId: string, body: Column): Observable<Column | Error> {
    return this.http.post<Column | Error>(`${this.generateUrl(boardId)}/columns`, body);
  }

  getColumnById(boardId: string, columnId: string): Observable<Column | Error> {
    return this.http.get<Column | Error>(`${this.generateUrl(boardId)}/columns/${columnId}`);
  }

  deleteColumn(boardId: string, columnId: string): Observable<any> {
    return this.http.delete(`${this.generateUrl(boardId)}/columns/${columnId}`);
  }

  updateColumn(boardId: string, columnId: string, body: Column): Observable<Column | Error> {
    return this.http.put<Column | Error>(`${this.generateUrl(boardId)}/columns/${columnId}`, body);
  }
}
