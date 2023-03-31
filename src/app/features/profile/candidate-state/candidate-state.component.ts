import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';
import { State } from 'src/app/_models/enums/state';
import { Interview } from 'src/app/_models/interview';
import { Result } from 'src/app/_models/enums/result';

@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css'],
})
export class CandidateStateComponent implements OnInit {
  @Input() candidate!: Candidate;
  @Input() interviews!: Interview[];
  allStages: any[] = [];

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

  constructor(public dataService: DataService) {
    for (let i in State)
      this.allStages.push({ optionLabel: (State as any)[i], optionValue: i });
  }

  ngOnInit() {}
}
