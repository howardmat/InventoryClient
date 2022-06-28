import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { catchError, tap, take } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface RefreshResponseData {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Declare Urls to be used
  readonly AuthAPI =
    environment.firebase.authApiUrl + environment.firebase.webApiKey;
  readonly RefreshAPI =
    environment.firebase.refreshApiUrl + environment.firebase.webApiKey;

  // Properties
  private tokenExpirationTimer: any;
  public userSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  public login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<AuthResponseData> {
    // Make post request to authenticate endpoint with credentials
    return this.http
      .post<AuthResponseData>(`${this.AuthAPI}`, {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(errorRes => {
          // Return the error message as a thrown error
          return throwError(this.parseErrorMessage(errorRes));
        }),
        tap(resp => {
          // Use the user object to handle the successful login
          this.handleAuth(
            resp.email,
            resp.localId,
            resp.idToken,
            resp.refreshToken,
            +resp.expiresIn,
            rememberMe
          );
        })
      );
  }

  private refresh(refreshToken: string): void {
    // Make post request to refresh endpoint with refreshToken
    this.http
      .post<RefreshResponseData>(`${this.RefreshAPI}`, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .pipe(
        take(1),
        catchError(errorRes => {
          // Parse the error response for a message
          const errorMessage = this.parseErrorMessage(errorRes);

          // Log user out
          this.logout();

          // Return the error message as a thrown error
          return throwError(errorMessage);
        })
      )
      .subscribe(resp => {
        // Use the user object to handle the successful token refresh
        this.handleRefreshAuth(
          resp.user_id,
          resp.id_token,
          resp.refresh_token,
          +resp.expires_in
        );
      });
  }

  public autoLogin(): void {
    // Get the userData json from localStorage
    const userData = this.getStorageUserData();
    if (!userData) {
      return;
    }

    // Create a new user from the stored data
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.rememberMe,
      userData._token,
      userData._refreshToken,
      new Date(userData._tokenExpirationDate)
    );

    // Check token validity and emit user via subject and start autoLogout timer
    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoRefresh(expirationDuration, loadedUser.refreshToken);
    } else if (loadedUser.refreshToken) {
      // check for refresh token and try to get new token
      this.refresh(loadedUser.refreshToken);
    }
  }

  public logout(): void {
    // Emit a null user, pass user back to login page and clear local storage
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);

    // Remove data from local and session storage
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');

    // Clear the timer if it was set
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  public getRememberMeEmail(): string | null {
    // Get the value stored or return null if it doesn't exist
    const rememberMeValue = localStorage.getItem('rememberMe');
    return rememberMeValue ?? null;
  }

  /**
   * Automatically triggers attempt to refresh token
   * @param expirationDuration Duration in milliseconds
   * @param refreshToken 
   */
  private autoRefresh(expirationDuration: number, refreshToken: string): void {
    // Set a timer that will try to refresh the token.
    // timeout 5 seconds before the actual expiration for buffer
    this.tokenExpirationTimer = setTimeout(() => {
      this.refresh(refreshToken);
    }, expirationDuration - 5000);
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    refreshToken: string,
    expiresIn: number,
    rememberMe: boolean
  ): void {
    // Set the stored data
    this.setStorageUserData(
      email,
      userId,
      token,
      refreshToken,
      expiresIn,
      rememberMe
    );

    // Start the autoRefresh timer
    this.autoRefresh(expiresIn * 1000, refreshToken);
  }

  private handleRefreshAuth(
    userId: string,
    token: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    // Get the existing userData
    const userData = this.getStorageUserData();
    if (!userData) {
      return;
    }

    // Update the stored data
    this.setStorageUserData(
      userData.email,
      userId,
      token,
      refreshToken,
      expiresIn,
      userData.rememberMe
    );

    // Start the autoRefresh timer
    this.autoRefresh(expiresIn * 1000, refreshToken);
  }

  private parseErrorMessage(errorRes: HttpErrorResponse): string {
    // Set a default message
    let errorMessage = 'An unexpected error occurred';

    // Throw default message as a thrown error if error property doesn't exist
    if (!errorRes.error || !errorRes.error.error) {
      return errorMessage;
    }

    // Get message from error property
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid login attempt';
        break;
      case 'INVALID_REFRESH_TOKEN':
        errorMessage = 'Bad token';
        break;
    }

    return errorMessage;
  }

  private getStorageUserData(): {
    email: string;
    id: string;
    rememberMe: boolean;
    _token: string;
    _refreshToken: string;
    _tokenExpirationDate: string;
  } | null {
    // Parse the local and session storage for our userData object
    const userDataJson =
      localStorage.getItem('userData') ?? sessionStorage.getItem('userData');
    return userDataJson ? JSON.parse(userDataJson) : null;
  }

  private setStorageUserData(
    email: string,
    userId: string,
    token: string,
    refreshToken: string,
    expiresIn: number,
    rememberMe: boolean
  ): void {
    // Set expiration date based on expiresIn value (seconds)
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    // Create new user, emit them via subject, and save to local storage
    const user = new User(
      email,
      userId,
      rememberMe,
      token,
      refreshToken,
      expirationDate
    );
    this.userSubject.next(user);

    // Check the RememberMe setting
    if (rememberMe) {
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('rememberMe', email);
    } else {
      sessionStorage.setItem('userData', JSON.stringify(user));
      localStorage.removeItem('rememberMe');
    }
  }
}
