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
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ErrorhandlerService implements HttpInterceptor {
  constructor(
    private router: Router,
    private messageService: MessageService,
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
          //console.log('Error');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });

        } else {
          // if (err.statusText === 'Unknown Error') {
          //   console.log(err);
          //   this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });

          // } else {
          //   //console.log();
          //   this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });

          // }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
        return throwError(() => new Error('error'));
      })
    );
  }
}
