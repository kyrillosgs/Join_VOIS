import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './LocalStorage.service';
import { AccountService } from './account.service';
import { LocalStorageKeys } from '../_models/enums/local-storage-keys.enum';
import { AppJwtData } from '../_models/Interfaces/app-security-factory.interface';
import { DateUtil } from '../_helpers/DateUtil';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
/** @description this class is the base for authentication such as
 * login , register , signin , signout , activate account , reset password , check user is login or logout
 */
export class AuthService {
  private jwtService = new JwtHelperService();
  /** this observable is ued to send loggin state between other componentns */
  private isUserLoggedIn$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private accountService: AccountService
  ) {}

  /** toggle between login state */
  setLoginState(isLoggedIn: boolean = false) {
    this.isUserLoggedIn$.next(isLoggedIn);
  }

  /** get login state */
  /** get current login state */
  getLogginState() {
    let currState = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_LOGGED_IN
    );

    //  console.log('curr state from auth servie on start up: ', currState?.isLoggedIn);

    this.isUserLoggedIn$.next(currState?.isLoggedIn);
    // ConsoleService.success('current state again is here is: ' + currState?.isLoggedIn);
    // return this.isUserLoggedIn$.asObservable();
    return this.isUserLoggedIn$.asObservable();
  }

  /** sign out from app and clear storage from keys */
  signOut() {
    this.localStorageService.removeSession(LocalStorageKeys.APP_TOKEN);
    this.localStorageService.removeSession(LocalStorageKeys.APP_LOGGED_IN);
    this.localStorageService.removeSession(LocalStorageKeys.APP_REFRESH_TOKEN);
    this.setLoginState(false);
    this.isUserLoggedIn$.next(false);
  }

  /** decode jwt data */
  getDecodedData(userToken: any): any {
    return this.jwtService.decodeToken(userToken);
  }

  get userTokenData() {
    return this.getTokenDataAfterDecode();
  }

  get userRoles() {
    let rolesArray = this.userTokenData?.roles!.split(',');
    return rolesArray;
  }

  /** get token data decoded for work */
  getTokenDataAfterDecode(): any {
    const tokenData = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_TOKEN
    );
    return this.jwtService.decodeToken(tokenData);
  }

  /** check is token expired or not */
  isTokenExpired() {
    const tokenData = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_TOKEN
    );

    if (tokenData) {
      return this.jwtService.isTokenExpired(tokenData);
    } else {
      return true;
    }
  }

  /** get expiration date for mtoken */
  getTokenExpirationDate() {
    const tokenData = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_TOKEN
    );
    return DateUtil.formatDate(
      this.jwtService.getTokenExpirationDate(tokenData),
      'DD/MM/YYYY'
    );
  }

  /** @description get all user roles from token */
  getUserRoles(): string[] {
    let tokenData = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_TOKEN
    );

    if (tokenData) {
      return this.getDecodedData(tokenData)?.user?.role?.split(',');
    } else {
      return [];
    }
  }

  getUserInfo(): AppJwtData | null {
    const tokenData = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_TOKEN
    );
    return tokenData ? this.getDecodedData(tokenData) ?? null : null;
  }

  getToken(): string | null {
    const token: string | null = this.localStorageService.getSessionStorage(
      LocalStorageKeys.APP_TOKEN
    );
    return token;
  }

  getRefreshToken(): string | null {
    const refreshToken: string | null =
      this.localStorageService.getSessionStorage(
        LocalStorageKeys.APP_REFRESH_TOKEN
      );
    return refreshToken;
  }

  refreshToken() {
    const tokenModel = {
      accessToken: this.getToken(),
      refresh_token: this.getRefreshToken(),
    };
    return this.http.post<any>(
      environment.apiURL + 'api/refresh_token',
      tokenModel
    );
  }

  async refreshingTokens(token: string | null): Promise<boolean> {
    const refreshToken: string | null =
      this.localStorageService.getSessionStorage(
        LocalStorageKeys.APP_REFRESH_TOKEN
      );

    if (!token || !refreshToken) {
      return false;
    }

    const tokenModel = { accessToken: token, refresh_token: refreshToken };
    let isRefreshSuccess: boolean;
    try {
      const response = await this.accountService
        .refreshToken(tokenModel)
        .toPromise();
      const newToken = (<any>response).token;
      const newRefreshToken = (<any>response).refresh_token;
      this.localStorageService.setSessionStorage(
        LocalStorageKeys.APP_TOKEN,
        newToken
      );
      this.localStorageService.setSessionStorage(
        LocalStorageKeys.APP_REFRESH_TOKEN,
        newRefreshToken
      );
      isRefreshSuccess = true;
    } catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }
}
