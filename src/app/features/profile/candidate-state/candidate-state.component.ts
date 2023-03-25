import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';



@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css']
})
export class CandidateStateComponent implements OnInit {
  public candidateId!: number;
  protected candidate!: Candidate;
  
  
  allStages = this.dataService.getStages();
    constructor(
      route: ActivatedRoute,
      public dataService: DataService,
      public httpClient: HttpClient) {
        route.params.subscribe((params) => {
          this.candidateId = params['id'];
        });
        this.getCandidate();
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
