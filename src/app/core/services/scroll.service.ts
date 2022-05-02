import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  public anchorScroll$ = new BehaviorSubject<string | null>(null);
}
