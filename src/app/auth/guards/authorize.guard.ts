import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { UserAuthServiceService } from '../services/user-auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivate {
  constructor(private authService: UserAuthServiceService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { url } = state;

    return this.checkLogin(url);
  }

  checkLogin(url: string): true | UrlTree {
    if (this.authService.isAuthorized === 'true') {
      return true;
    }
    console.log('router works');
    this.authService.redirectUrl = url;
    return this.router.parseUrl('/auth/login');
  }
}
