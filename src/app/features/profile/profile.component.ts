import { HttpClient } from '@angular/common/http';
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
  public candidateId!: number;
  protected candidate!: Candidate;
  display: boolean = false;
  pdfSrc: any = '';

  constructor(
    route: ActivatedRoute,
    public dataService: DataService,
    public httpClient: HttpClient
  ) {
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

  ngOnInit(): void {
    this.httpClient
      .get(this.candidate.cv as string, {
        responseType: 'arraybuffer',
      })
      .subscribe(
        async (data) => {
          this.pdfSrc = await data;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
