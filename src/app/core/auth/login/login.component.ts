import { NgxPermissionsService } from 'ngx-permissions';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, NgZone, OnInit,OnDestroy } from '@angular/core';
import { RxFormControl, RxFormGroup, RxwebValidators,RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AppJwtData, AppUserRoles } from 'src/app/_models/Interfaces/app-security-factory.interface';
import { LocalStorageKeys } from 'src/app/_models/enums/local-storage-keys.enum';
import { AccountService } from 'src/app/_services/account.service';
import { AuthenticationResponse, LoginDto } from 'src/app/_models/account.model';
import { AppBaseResponse } from 'src/app/_models/Interfaces/app-response.inerface';
import { LocalStorageService } from 'src/app/_services/LocalStorage.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  loginForm: RxFormGroup = {} as RxFormGroup;
  userTokenData: AppJwtData = {};

  get emailRxf(): RxFormControl {
    return this.loginForm.get('email') as RxFormControl;
  }
  get passwordRxf(): RxFormControl {
    return this.loginForm.get('password') as RxFormControl;
  }


  constructor(
    injector: Injector,
    private accountService: AccountService,
    private localStorageService: LocalStorageService,
    private permissionService: NgxPermissionsService,
    private authService: AuthService,
    private formBuilder: RxFormBuilder,
    private ngZone: NgZone,
    private router: Router,
    ) {
      // private alertService: ToasterService
    this.checkBefInit();
  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }

  checkBefInit = () => {
    const userToken = this.localStorageService.getSessionStorage(LocalStorageKeys.APP_TOKEN);
    if (userToken|| !this.authService.isTokenExpired() ) {
      this.userTokenData = this.authService.getTokenDataAfterDecode();
      this.redirectUsersBasedOnRole(this.userTokenData);
    }
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',
        [
          RxwebValidators.required(),
          RxwebValidators.email(),
          RxwebValidators.maxLength({ value: 50 })
        ]
      ],
      password: ['',
        [
          RxwebValidators.required()
        ]
      ],
    }) as RxFormGroup;
  }



  submit(): void {

    const formData$ = this.loginForm.getRawValue() as LoginDto;
    if (this.loginForm.invalid) {
      // this.AlertToaster.showToastWarn(transMsg[0], true, 2500);
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity({
        emitEvent: true,
      });
    } else {
      /** show loding spinner */
      //this.LoginHttpState = true;
      this.accountService.login(formData$).subscribe(
        (_:any /*AppBaseResponse<AuthenticationResponse>*/) => {
          if (_.message ==  "Login successful") {
            this.localStorageService?.setSessionStorage(LocalStorageKeys.APP_TOKEN, _.token);
            //this.localStorageService?.setSessionStorage(LocalStorageKeys.APP_REFRESH_TOKEN, _.content?.refreshToken);
            this.localStorageService?.setSessionStorage(LocalStorageKeys.APP_LOGGED_IN, { isLoggedIn: true });
            this.userTokenData = this.authService.getTokenDataAfterDecode();

            this.authService.setLoginState(true);
            //this.permissionService.loadPermissions(this.authService.getUserRoles());
            this.permissionService.loadPermissions([AppUserRoles.ADMIN]);
            this.redirectUsersBasedOnRole(this.userTokenData);

          } else {
            //this.AlertToaster.showToastError(_.message ?? '', true, 2500);
          }
        },
        (err: HttpErrorResponse) => {
          //this.LoginHttpState = false;
          //this.AlertToaster.showToastError(err?.error?.Message, true, 2500);
        }
      );
    }
  }

  /** permision navigation method */
  redirectUsersBasedOnRole = (rolesPermission: AppJwtData): void => {
    const rolesArray = rolesPermission?.roles?.split(',');
    // if (rolesArray?.includes(AppUserRoles.ADMIN)) {
    //   this.ngZone.run(() => this.navigateTo('/home'));
    // } 
    this.ngZone.run(() => this.navigateTo('/home'));
  }


  navigateTo = (url: string) => {
    this.router.navigate([url]);
  }

  validate(formControlName: RxFormControl, validationName: string): boolean {
    return formControlName.hasError(validationName);
  }

  // togglePasswordFieldType(psEleTemp: any, spEleTemp: any, icEleTemp: any): void {
  //   if (psEleTemp.type === 'password') {
  //     psEleTemp.type = 'text';
  //     spEleTemp.className = 'input-group-text input-password-show';
  //     icEleTemp.className = 'fa text-gray-app-2 fa-eye-slash';
  //   } else {
  //     psEleTemp.type = 'password';
  //     spEleTemp.className = 'input-group-text input-password-hide';
  //     icEleTemp.className = 'fa fa-eye text-gray-app-2';
  //   }
  // }
}

