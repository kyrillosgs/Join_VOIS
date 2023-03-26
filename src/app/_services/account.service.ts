import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationResponse, LoginDto } from '../_models/account.model';
import { AppBaseResponse } from '../_models/Interfaces/app-response.inerface';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  login (model: LoginDto): Observable<AppBaseResponse<AuthenticationResponse>> 
  {
    return this.http.post<AppBaseResponse<AuthenticationResponse>>('https://hiring-tool.ahmedsaleh.net/api/login', model);
  } 
  refreshToken = (model: any): Observable<AppBaseResponse<any>> => this.http.post<any>('https://hiring-tool.ahmedsaleh.net/api/refresh_token', model);
  
  
  // public getAll<T>(

  // ): Observable<T> {
  //   return this.http.get<T>(
  //     ``,
  //     {
  //       params: queryParams ? queryParams : {},
  //     }
  //   );
  // }

  // public getOne<T>(
  //   serverId: CsmServers,
  //   uri: string,
  //   id?: string,
  //   queryparams?: any
  // ): Observable<T> {
  //   return this.http.get<T>(
  //     `${this.getServerByName(serverId)}${uri ? uri : ''}${id}`,
  //     {
  //       params: queryparams ? queryparams : {},
  //     }
  //   );
  // }

  // public post<T>(
  //   serverId: CsmServers,
  //   uri: string,
  //   objectToUpdate: any,
  //   queryPrams?: any
  // ): Observable<T> {
  //   return this.http.post<T>(
  //     `${this.getServerByName(serverId)}${uri}`,
  //     objectToUpdate,
  //     { params: queryPrams ? queryPrams : {} }
  //   );
  // }
}
