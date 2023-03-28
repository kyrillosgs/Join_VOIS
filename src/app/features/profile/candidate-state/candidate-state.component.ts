import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';
import { State } from 'src/app/_models/enums/state';


@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css']
})
export class CandidateStateComponent implements OnInit {
  public candidateId!: number;
  protected candidate!: Candidate;
  allStages : any[]=[];
  
  
    constructor(
      route: ActivatedRoute,
      public dataService: DataService,
      public httpClient: HttpClient) {
        route.params.subscribe((params) => {
          this.candidateId = params['id'];
        });
        this.getCandidate();
        for (let i in State)
          this.allStages.push({ optionLabel: (State as any)[i], optionValue: i });
    }

  ngOnInit() {
  }

  getCandidate() {
    for (let column of this.dataService.getData().columns) {
      this.candidate = column.candidates.find(
        (candidate) => candidate.id == this.candidateId
      ) as Candidate;
      if (this.candidate) break;
    }
  }

}
