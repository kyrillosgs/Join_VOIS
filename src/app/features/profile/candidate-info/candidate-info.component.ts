import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-candidate-info',
  templateUrl: './candidate-info.component.html',
  styleUrls: ['./candidate-info.component.css'],
})
export class CandidateInfoComponent implements OnInit {
  @ViewChild('addTag') public addTag!: ElementRef;

  public candidateId!: number;
  protected candidate!: Candidate;
  display: boolean = false;
  pdfSrc: any = '';
  newTag: string = '';
  addingTag: boolean = false;
  hoveredTag: number = -1;

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

  onSidebarShow() {
    (document.querySelector('.p-sidebar-content') as any).style.padding = '0';
  }

  addTagToCandidate() {
    if (this.newTag.trim()) this.candidate.tags?.push(this.newTag);
    this.addingTag = false;
    this.newTag = '';
  }

  addTagClick() {
    this.addTag.nativeElement.classList.add('p-input-icon-right');
    // this.addTag.nativeElement.innerHTML = `<i class="pi pi-check" (click)="addTagToCandidate()"></i>
    // <input type='text'  pInputText [(ngModel)]="newTag" class="add-tag-input text-light"/>`;
    this.addingTag = true;
    window.setTimeout(() => {
      try {
        this.addTag.nativeElement.querySelector('.add-tag-input').focus();
      } catch {}
    }, 100);
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
