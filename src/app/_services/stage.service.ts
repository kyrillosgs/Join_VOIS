import { Injectable } from '@angular/core';
import { Istage } from '../_models/Interfaces/Istage';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  
  private stages: Istage[] =[
    {
      name: "Phone screening",
      code: 1
    }, {
      name: "Technical Interview",
      code: 2
    },
    {
      name: "Managerial Interview",
      code: 3
    },
    {
      name: "HR Interview",
      code: 4
    }
  ];

  public selectedStage: Istage =this.stages[0];

  constructor() {

  }

  public getStages() : any[]{
    //["Phone screening", "Technical Interview", "Technical Interview", "Managerial Interview", "HR Interview" ]
    return this.stages;
  }

  public setSelectedStage(selectedStageCode:number){
    this.selectedStage = <Istage>this.stages.find( (stage) => stage.code == selectedStageCode);
  }

  public getSelectedStage(): Istage{
    return this.selectedStage;
  }
}
