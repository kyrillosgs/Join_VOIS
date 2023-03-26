import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private candidateId!: number;
  protected candidate!: Candidate;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.candidateId = params['id'];
    });
  }
  ngOnInit(): void {
    this.dataService.getCandidate(this.candidateId).subscribe(
      (data) => {
        this.candidate = data.data;
      },
      (error) => {}
    );
  }
}
