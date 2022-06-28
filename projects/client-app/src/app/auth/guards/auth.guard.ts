import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";

import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Implement canActivate function
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> 
  {
    // Check the state of the user and if it's null than pass them back to login
    return this.authService.userSubject.pipe(
      take(1),
      map(user => {
        // Check if the user is not null (falsey)
        if (!!user) {
          return true;
        }
        return this.router.createUrlTree(["/auth/login"]);
      })
    );
  }
}
