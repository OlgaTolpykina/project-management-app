import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterUser$ = new Subject<string>();

  filterDone$ = new Subject<boolean>();

  setUser(userId: string): void {
    this.filterUser$.next(userId);
  }

  getUserId(): Subject<string> {
    return this.filterUser$;
  }

  setDone(flag: boolean): void {
    this.filterDone$.next(flag);
  }

  getFilterDone(): Subject<boolean> {
    return this.filterDone$;
  }
}
