import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';
import { ConfirmationService } from 'primeng/api';

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
  imgSrc: any = '';
  newTag: any = '';
  addingTag: boolean = false;
  hoveredTag: number = -1;

  constructor(
    route: ActivatedRoute,
    public dataService: DataService,
    public httpClient: HttpClient,
    private confirmationService: ConfirmationService
  ) {
    route.params.subscribe((params) => {
      this.candidateId = params['id'];
    });
  }

  confirmTagRemoval(event: Event, index: number) {
    this.confirmationService.confirm({
      target: event.target as any,
      message: 'Remove tag "' + (this.candidate.tags as any)[index] + '"?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.candidate.tags?.splice(index, 1);
      },
      reject: () => {
        //reject action
      },
    });
  }

  getCandidate() {
    this.candidate = this.dataService.allCandidates.find(
      (c) => c.id == this.candidateId
    ) as Candidate;
  }

  onSidebarShow() {
    (document.querySelector('.p-sidebar-content') as any).style.padding = '0';
  }

  addTagToCandidate() {
    if (
      this.newTag.trim() &&
      !this.candidate.tags?.find(
        (tag) =>
          tag.toLowerCase() ==
          (this.newTag as any).removeExtraSpaces().toLowerCase()
      )
    )
      this.candidate.tags?.push(this.newTag.removeExtraSpaces());
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
    this.getCandidate();
    // this.dataService
    //   .getAttachment(this.candidate.cv as string)
    //   .subscribe((data) => {
    //     this.pdfSrc = data;
    //   });
    // this.dataService
    //   .getAttachment(this.candidate.img as string)
    //   .subscribe((data) => {
    //     this.imgSrc = data;
    //   });
    this.pdfSrc = 'https://hiring-tool.ahmedsaleh.net/' + this.candidate.cv;
  }
}

(String.prototype as any).removeExtraSpaces = function () {
  var str = this.trim();
  var res = '';
  var lastC;
  for (let i in str) {
    if (isNaN(i as any)) break;
    if (lastC == str[i] && str[i] == ' ') continue;
    else res += str[i];
    lastC = str[i];
  }
  return res;
};
