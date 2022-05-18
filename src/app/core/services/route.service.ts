import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  public currentRoute$ = new BehaviorSubject<string>(this.router.url);

  constructor(private router: Router) {}

  getRoute() {
    this.currentRoute$.next(this.router.url);
  }
}
