import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalStorageKeys } from './_models/enums/local-storage-keys.enum';
import { AuthService } from './_services/auth.service';
import { LocalStorageService } from './_services/LocalStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Join_VOIS';
  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }
  get isAuth() {
    const userToken = this.localStorageService.getSessionStorage(LocalStorageKeys.APP_TOKEN);
    if (userToken || !this.authService.isTokenExpired())
      return false;
    else
      return true;
  }
}
