import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board } from 'src/app/_models/board';
import { DataService } from 'src/app/_services/data.service';
import { Candidate } from 'src/app/_models/candidate';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { State } from 'src/app/_models/enums/state';
import { Team } from 'src/app/_models/team';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(AddCandidateComponent)
  addCandidateComponent!: AddCandidateComponent;
  public destroyed = new Subject<any>();
  loading: boolean = true;
  teams: Team[] = [];
  selectedTeams: Team[] = this.dataService.selectedTeamsCache;

  public addCandidate() {
    this.addCandidateComponent.submit = true;
    this.addCandidateComponent.add();
  }

  changeTeams(e: any) {
    if (this.selectedTeams.find((t) => t.id == e.itemValue.id))
      this.retrieveTeamCandidates(e.itemValue.id);
    else this.removeTeamCandidates(e.itemValue.id);
  }

  public resetCandidate() {
    this.addCandidateComponent.resetAddCandidateForm();
  }

  constructor(private dataService: DataService, private router: Router) {}

  public get Board(): Board {
    return this.dataService.getData();
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
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
      if (candidates[c].team_id == id) {
        this.dataService.allCandidates.splice(c, 1);
        c--;
      }
    }
    this.dataService.drawBoard();
  }

  ngOnInit() {
    this.teams = this.dataService.loggedInUser.teams;
    this.dataService.allCandidates = [];
    if (this.selectedTeams.length == 0) {
      this.selectedTeams.push(this.teams[0]);
      this.retrieveTeamCandidates(this.selectedTeams[0].id);
    } else {
      this.dataService.drawBoard();
      this.selectedTeams.forEach((t) => {
        this.retrieveTeamCandidates(t.id);
      });
    }
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntil(this.destroyed)
      )
      .subscribe(() => {
        this.display = false;
      });
  }
  ngOnDestroy(): void {
    this.dataService.selectedTeamsCache = this.selectedTeams;
    this.destroyed.next(1);
    this.destroyed.complete();
  }

  drop(event: CdkDragDrop<Candidate[]>, columnName: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      let newState =
        Object.keys(State)[Object.values(State).indexOf(columnName)];
      let candidate = event.container.data.find((c) => c.state != newState);
      this.dataService
        .editCandidate(candidate?.id as number, { state: newState })
        .subscribe((data) => {});
    }
  }
}
