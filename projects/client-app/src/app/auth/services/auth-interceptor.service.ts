import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  // Implement intercept function
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // userSubject in authService is an observable. The take function is saying we only want a single instance of the user object.
    //  So it will automatically unsubscribe once it has one.
    // The exhaustMap function is then waiting for the user observable to finish before it triggers the inner code. This
    //  will return another observable which is the value that ultimately gets returned from this function.
    return this.authService.userSubject.pipe(
      take(1),
      exhaustMap(user => {
        // If the user object is null than let the request continue unmodified
        if (!user) {
          return next.handle(req);
        }

        // Create a copy of the request object and append the auth param to the copy
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token ? user.token : '')
        });

        // Continue the request with the modified request object
        return next.handle(modifiedReq);
      })
    );
  }
}
