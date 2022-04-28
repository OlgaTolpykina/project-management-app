import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '@app/constants';
import { Error } from '@shared/types/error.model';
import { AuthInfo } from '@shared/types/be-auth.model';
import { User } from '@shared/types/user.model';

@Injectable({
  providedIn: 'root',
})
export class BeAuthService {
  constructor(private http: HttpClient) {}

  signin(body: AuthInfo): Observable<{ token: string } | Error> {
    return this.http.post<{ token: string } | Error>(`${BASE_URL}/signin`, body);
  }

  signup(body: User): Observable<User | Error> {
    return this.http.post<User | Error>(`${BASE_URL}/signup`, body);
  }
}
