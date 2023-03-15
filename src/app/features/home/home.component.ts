import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board } from 'src/app/_models/board';
import { DataService } from 'src/app/_services/data.service';
import { Candidate } from 'src/app/_models/candidate';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(AddCandidateComponent)
  addCandidateComponent!: AddCandidateComponent;

  public addCandidate() {
    this.addCandidateComponent.submit = true;
    this.addCandidateComponent.add();
  }

  public resetCandidate() {
    (document.querySelector('#cimage') as any).querySelector('button')?.click();
    this.addCandidateComponent.addCandidateForm.reset();
    this.addCandidateComponent.submit = false;
    this.addCandidateComponent.clearPDF();
  }

  constructor(private _dataService: DataService) {}

  public get Board(): Board {
    return this._dataService.getData();
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
  }
  ngOnInit() {}

  drop(event: CdkDragDrop<Candidate[]>) {
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
    }
  }
}
