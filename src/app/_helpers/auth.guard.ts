import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { LocalStorageKeys } from '../_models/enums/local-storage-keys.enum';
import { AppUserRoles } from '../_models/Interfaces/app-security-factory.interface';
import { AuthService } from '../_services/auth.service';
import { LocalStorageService } from '../_services/LocalStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private locatStorageService: LocalStorageService,
    private authService: AuthService,
    //private alertService: ToasterService,
    private permissionService: NgxPermissionsService
  ) { }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //   return true;
  // }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | any> {
    const userToken = this.locatStorageService.getSessionStorage(LocalStorageKeys.APP_TOKEN);
    if (!userToken || this.authService.isTokenExpired()) {
      const isRefreshSuccess = await this.authService.refreshingTokens(userToken);
      if (!isRefreshSuccess) {
        this.authService.signOut();
        this.router.navigate(['/login']);
        return false;
      } else {
        this.permissionService.loadPermissions(this.authService.getUserRoles());
        return true;
      }
    }
    else {
      this.permissionService.loadPermissions(this.authService.getUserRoles());
      //this.permissionService.loadPermissions([AppUserRoles.ADMIN]);
      return true;
    }
  }
}
