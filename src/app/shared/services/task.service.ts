import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '@app/constants';
import { Error } from '@shared/types/error.model';
import { Task } from '@shared/types/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  url = `${BASE_URL}/boards`;

  constructor(private http: HttpClient) {}

  generateUrl(boardId: string, columnId: string): string {
    return `${this.url}/${boardId}/columns/${columnId}/tasks`;
  }

  getAllTasks(boardId: string, columnId: string): Observable<Task[] | Error> {
    return this.http.get<Task[] | Error>(`${this.generateUrl(boardId, columnId)}`);
  }

  createTask(boardId: string, columnId: string, body: Task): Observable<Task | Error> {
    return this.http.post<Task | Error>(`${this.generateUrl(boardId, columnId)}`, body);
  }

  getTaskById(boardId: string, columnId: string, taskId: string): Observable<Task | Error> {
    return this.http.get<Task | Error>(`${this.generateUrl(boardId, columnId)}/${taskId}`);
  }

  deleteTask(boardId: string, columnId: string, taskId: string): Observable<any> {
    return this.http.delete(`${this.generateUrl(boardId, columnId)}/${taskId}`);
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    body: Task,
  ): Observable<Task | Error> {
    return this.http.put<Task | Error>(`${this.generateUrl(boardId, columnId)}/${taskId}`, body);
  }
}
