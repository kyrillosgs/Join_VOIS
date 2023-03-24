import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorhandlerService implements HttpInterceptor {
  constructor(
    private router: Router
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // retry(1),
      catchError((err: HttpErrorResponse) => {
        // << check client side error >> //
        if (err.error instanceof ErrorEvent) {
          console.log('Error');

        } else {
          if (err.statusText === 'Unknown Error') {
            console.log(err);
          } else {
            console.log();
          }
        }
        return throwError(() => new Error('error'));
      })
    );
  }
}
