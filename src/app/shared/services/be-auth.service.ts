import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';
import { Error } from '@shared/types/error.model';
import { User } from '@shared/types/user.model';

@Injectable({
  providedIn: 'root',
})
export class BeAuthService {
  constructor(private http: HttpClient) {}

  signIn(body: User): Observable<{ token: string } | Error> {
    return this.http.post<{ token: string } | Error>(`${environment.BASE_URL}/signin`, body);
  }

  signup(body: User): Observable<User | Error> {
    return this.http.post<User | Error>(`${environment.BASE_URL}/signup`, body);
  }
}
