import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';
import { State } from 'src/app/_models/enums/state';


@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css'],
})
export class CandidateStateComponent implements OnInit {
  @Input() candidate!: Candidate;
  allStages : any[]=[];
  constructor(public dataService: DataService) {
    for (let i in State)
    this.allStages.push({ optionLabel: (State as any)[i], optionValue: i });
  }

  ngOnInit() {}
}
