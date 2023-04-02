import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { LocalStorageKeys } from 'src/app/_models/enums/local-storage-keys.enum';
import { Role } from 'src/app/_models/enums/role';
import { Team } from 'src/app/_models/team';
import { AuthService } from 'src/app/_services/auth.service';
import { DataService } from 'src/app/_services/data.service';
import { LocalStorageService } from 'src/app/_services/LocalStorage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  protected items!: MenuItem[];
  loading: boolean = true;
  teams: Team[] = [];
  selectedTeams!: Team[];
  //showHeader:boolean=false;

  changeTeams(e: any) {
    if (!e.itemValue && e.value.length == 0) this.clearBoard();
    else if (!e.itemValue)
      e.value.forEach((t: Team) => {
        if (!this.selectedTeams.find((tt) => t.id == tt.id))
          this.retrieveTeamCandidates(t.id);
      });
    else if (
      this.dataService.selectedTeamsCache.find((t) => t.id == e.itemValue.id)
    )
      this.retrieveTeamCandidates(e.itemValue.id);
    else this.removeTeamCandidates(e.itemValue.id);
    this.selectedTeams = Array.from(this.dataService.selectedTeamsCache);
    this.dataService.selectedTeamsBS.next(this.dataService.selectedTeamsCache);
  }

  clearBoard() {
    this.dataService.allCandidates = [];
    this.dataService.drawBoard();
  }

  retrieveTeamCandidates(id: number) {
    this.dataService.getAllCandidates(id).subscribe(async (data) => {
      this.dataService.allCandidates.push(...(await data.data));
      this.dataService.drawBoard();
      this.loading = false;
    });
  }

  async removeTeamCandidates(id: number) {
    let candidates = this.dataService.allCandidates;
    for (let c = 0; c < candidates.length; c++) {
      if (candidates[c].team_id?.id == id) {
        this.dataService.allCandidates.splice(c, 1);
        c--;
      }
    }
    this.dataService.drawBoard();
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    protected dataService: DataService,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Pipeline',
        icon: 'pi pi-home',
        routerLink: '/home',
      },
      {
        label: 'Open Positions',
        icon: 'pi pi-briefcase',
        routerLink: '/positions',
      },
      {
        label: 'Question Bank',
        icon: 'pi pi-question',
        routerLink: '/questions',
      },
      {
        label: 'Tags Dashboard',
        icon: 'pi pi-tags',
        // routerLink: '/home',
        disabled: true,
      },
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: (event) => {
          this.showLogOut();
        },
        style: { '-webkit-text-stroke': '1px #e10000' },
      },
    ];
    if ((this.dataService.loggedInUser.role as any) == Role[1])
      this.teams = this.dataService.loggedInUser.teams as Team[];
    else if ((this.dataService.loggedInUser.role as any) == Role[2])
      this.dataService.getAllTeams().subscribe(
        (data) => {
          this.teams = data;
        },
        (error) => {}
      );
    if (
      !this.teams.find((t) => t.id == this.dataService.loggedInUser.team_id?.id)
    )
      this.teams.push(this.dataService.loggedInUser.team_id as Team);
    this.dataService.allCandidates = [];
    if (this.dataService.selectedTeamsCache.length == 0) {
      this.dataService.selectedTeamsCache.push(
        this.teams.find(
          (t) => t.id == this.dataService.loggedInUser.team_id?.id
        ) as Team
      );
      this.retrieveTeamCandidates(this.dataService.selectedTeamsCache[0].id);
    } else {
      this.dataService.drawBoard();
      this.dataService.selectedTeamsCache.forEach((t) => {
        this.retrieveTeamCandidates(t.id);
      });
    }
    this.selectedTeams = Array.from(this.dataService.selectedTeamsCache);
    this.dataService.selectedTeamsBS.next(this.dataService.selectedTeamsCache);
  }

  showLogOut(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to logout?',
      header: 'Logout',
      icon: 'pi pi-exclamation-triangle',
      key: 'logout',
      accept: () => {
        this.authService.signOut();
        (this.dataService.loggedInUser as any) = undefined;
        (this.dataService.allCandidates as any) = [];
        (this.dataService.selectedInterview as any) = undefined;
        (this.dataService.selectedTeamsCache as any) = [];
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
