import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageKeys } from '../_models/enums/local-storage-keys.enum';
import { LocalStorageService } from '../_services/LocalStorage.service';


@Injectable({
  providedIn: 'root',
})
export class HeadersService implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.localStorageService.getSessionStorage(LocalStorageKeys.APP_TOKEN);

    if (req.url.includes('api/login')) 
    {
      return next.handle(req);
    } 
    else if(req.url.includes('api/refresh_token')){
    let refreshToken = this.localStorageService.getSessionStorage(LocalStorageKeys.APP_REFRESH_TOKEN);
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${refreshToken}`),
      });
      return next.handle(req);
    }
    else {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(req);
    }
  }

}
