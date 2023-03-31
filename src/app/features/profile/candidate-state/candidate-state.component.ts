import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';
import { State } from 'src/app/_models/enums/state';
import { Interview } from 'src/app/_models/interview';
import { Result } from 'src/app/_models/enums/result';
import { ProfileComponent } from '../profile.component';
import { Stage } from 'src/app/_models/enums/stage';

@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css'],
})
export class CandidateStateComponent implements OnInit {
  @Input() candidate!: Candidate;
  @Input() interviews!: Interview[];
  allStages: any[] = [];

  moveToNextStage() {
    this.dataService
      .editCandidate(this.candidate.id, {
        state:
          Object.keys(State)[
            Object.keys(State).indexOf(this.candidate.state as any) + 1
          ],
      })
      .subscribe((data) => {
        this.profileComponent.retrieveInterviews();
      });
  }

  protected get successLabel() {
    return (this.candidate.state as any) == 'hr_interview'
      ? 'Accept'
      : 'Move to the next Stage';
  }

  protected get successIsDisabled() {
    return (
      this.interviews.find((i) => (i.type as any) == 'hr_interview')?.result ==
        (Result as any)[1] ||
      (this.interviews.find((i) => i.type == (this.candidate.state as any))
        ?.result as any) == (Result as any)[2]
    );
  }

  protected get interviewResult() {
    return (
      this.dataService.selectedInterview.result as any
    ).capitalizeEachWord();
  }

  protected get resultClass() {
    return (this.dataService.selectedInterview.result as any) == Result[0]
      ? 'secondary'
      : (this.dataService.selectedInterview.result as any) == Result[1]
      ? 'success'
      : 'danger';
  }

  constructor(
    public dataService: DataService,
    private profileComponent: ProfileComponent
  ) {
    for (let i in State)
      this.allStages.push({ optionLabel: (State as any)[i], optionValue: i });
  }

  ngOnInit() {}
}
