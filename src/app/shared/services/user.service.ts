import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';
import { User } from '@shared/types/user.model';
import { Error } from '@shared/types/error.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = `${environment.BASE_URL}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[] | Error> {
    return this.http.get<User[] | Error>(this.url);
  }

  getUserById(userId: string): Observable<User | Error> {
    return this.http.get<User | Error>(`${this.url}/${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.url}/${userId}`);
  }

  //TODO: May return User object
  updateUser(userId: string, body: User): Observable<User | Error> {
    return this.http.put<User | Error>(`${this.url}/${userId}`, body);
  }
}
