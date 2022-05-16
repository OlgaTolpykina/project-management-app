import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterExecKeyword$ = new Subject<string>();

  filterDone$ = new Subject<boolean>();

  setKeyword(keyword: string): void {
    this.filterExecKeyword$.next(keyword);
  }

  getFilterKeyword(): Subject<string> {
    return this.filterExecKeyword$;
  }

  setDone(flag: boolean): void {
    this.filterDone$.next(flag);
  }

  getFilterDone(): Subject<boolean> {
    return this.filterDone$;
  }
}
