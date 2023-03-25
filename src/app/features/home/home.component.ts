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
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
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
  teams: Team[] = [new Team(1, 'ServiceNow'), new Team(2, 'DevOps')];
  selectedTeams: Team[] = [];

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

  constructor(private _dataService: DataService, private router: Router) {}

  public get Board(): Board {
    return this._dataService.getData();
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  retrieveTeamCandidates(id: number) {
    this._dataService.getAllCandidates(id).subscribe(async (data) => {
      this._dataService.allCandidates.push(...(await data.data));
      this._dataService.drawBoard();
      this.loading = false;
    });
  }

  async removeTeamCandidates(id: number) {
    let candidates = this._dataService.allCandidates;
    for (let c = 0; c < candidates.length; c++) {
      if (candidates[c].team_id == id) {
        this._dataService.allCandidates.splice(c, 1);
        c--;
      }
    }
    this._dataService.drawBoard();
  }

  ngOnInit() {
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
      this._dataService
        .editCandidate(candidate?.id as number, { state: newState })
        .subscribe((data) => {});
    }
  }
}
