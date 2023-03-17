import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  public candidateId!: number;
  protected candidate!: Candidate;
  constructor(route: ActivatedRoute, public dataService: DataService) {
    route.params.subscribe((params) => {
      this.candidateId = params['id'];
    });
    this.getCandidate();
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
