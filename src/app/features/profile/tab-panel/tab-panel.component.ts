import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { State } from 'src/app/_models/enums/state';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.scss']
})
export class TabPanelComponent implements OnInit {
  public candidateId!: number;
  protected candidate!: Candidate;
  allStages : any[]=[];
  topics=[
    {
      name:"OOP Questions",
      code: 0
    },{
      name:"JavaScript Questions",
      code: 1
    },{
      name:"DataBase Questions",
      code: 2
    }];

  questions = [
    {
    question:"oop question1",
    score: 3,
    note: "good english",
    category:0
  },
  {
    question:"oop question2",
    score: 2,
    note: "good english",
    category: 0
  },
  {
    question:"oop question3",
    score: 2,
    note: "good english",
    category: 0
  },
  {
    question:"oop question4",
    score: 2,
    note: "good english",
    category: 0
  }
];

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

  //scrollableTabs: any[] = Array.from({ length: 50 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` }));
}
