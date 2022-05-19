import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BackgroundImgService {
  constructor(private http: HttpClient) {}

  getBackgroundImgs(count: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.BACKGROUND_IMG_URL}${count}`);
  }
}
