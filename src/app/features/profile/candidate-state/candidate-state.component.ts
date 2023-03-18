import { Component, OnInit } from '@angular/core';
import { Istage } from 'src/app/_models/Interfaces/Istage';
import { StageService } from 'src/app/_services/stage.service';


@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css']
})
export class CandidateStateComponent implements OnInit {

  selectedStage : Istage = this.stages.getSelectedStage();
  allStages = this.stages.getStages();
    constructor(private stages: StageService) {
    }


  score: number =30;

  ngOnInit() {
  }

}
