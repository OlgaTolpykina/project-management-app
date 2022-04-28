import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '@app/constants';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  url = `${BASE_URL}/file`;

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>(this.url, formData);
  }

  downloadFile(taskId: string, filename: string): Observable<any> {
    return this.http.get(`${this.url}/${taskId}/${filename}`);
  }
}
