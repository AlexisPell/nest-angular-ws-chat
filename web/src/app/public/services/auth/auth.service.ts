import { ILoginResponse } from './../../../models/login-res.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from 'src/app/models/user.interface';
import { tap, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

  login(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/api/users/login', user).pipe(
      tap((res: ILoginResponse) =>
        localStorage.setItem('chat_app_access_token', res.access_token)
      ),
      tap(() =>
        this.snackbar.open(`Login successfull`, 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      ),
      catchError((e) => {
        console.log('ERROR: ', e, e.error);
        this.snackbar.open(`Login error due to: ${e.error.message}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return throwError(e);
      })
    );
  }
}
