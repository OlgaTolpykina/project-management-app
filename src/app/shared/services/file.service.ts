import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  url = `${environment.BASE_URL}/file`;

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>(this.url, formData);
  }

  downloadFile(taskId: string, filename: string): Observable<any> {
    return this.http.get(`${this.url}/${taskId}/${filename}`);
  }
}
