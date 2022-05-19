import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  public isLoading$: Observable<boolean>;

  private isLoading$$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.isLoading$ = this.isLoading$$.asObservable();
  }

  public show() {
    this.isLoading$$.next(true);
  }

  public hide() {
    setTimeout(() => {
      this.isLoading$$.next(false);
    }, 1500);
  }
}
