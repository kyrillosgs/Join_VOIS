import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { LocalStorageKeys } from 'src/app/_models/enums/local-storage-keys.enum';
import { AuthService } from 'src/app/_services/auth.service';
import { LocalStorageService } from 'src/app/_services/LocalStorage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  protected items!: MenuItem[];
  //showHeader:boolean=false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Pipeline',
        icon: 'pi pi-home',
        routerLink: '/home',
      },
    ];
  }

  showLogOut(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      header: 'Logout',
      icon: 'pi pi-exclamation-triangle',
      key: 'logout',
      accept: () => {
        this.authService.signOut();
        this.router.navigate(['/login']);
        //this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content',life: 2000});
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
            break;
        }
      },
    });
  }
}
