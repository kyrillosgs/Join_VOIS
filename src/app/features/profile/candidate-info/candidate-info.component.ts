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
  downloadLink: any;
  newTag: any = '';
  addingTag: boolean = false;
  hoveredTag: number = -1;

  ngOnInit(): void {
    this.downloadLink = document.createElement('a');
    this.dataService.getCandidate(this.candidateId).subscribe(
      (data) => {
        this.candidate = data.data;
        this.imgSrc =
          'https://hiring-tool.ahmedsaleh.net/' + this.candidate.img;
        this.downloadLink.setAttribute('download', this.candidate.name);
      },
      (error) => {}
    );
    this.dataService.getCV(this.candidateId).subscribe(
      (data) => {
        this.pdfSrc = data;
        this.downloadLink.href = window.URL.createObjectURL(
          new Blob([this.pdfSrc], { type: 'application/pdf' })
        );
      },
      (error) => {}
    );
  }

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

  downloadCV() {
    document.body.appendChild(this.downloadLink);
    this.downloadLink.click();
  }

  confirmTagRemoval(event: Event, index: number) {
    this.confirmationService.confirm({
      target: event.target as any,
      message: 'Remove tag "' + (this.candidate.tags as any)[index] + '"?',
      icon: 'pi pi-exclamation-triangle',
      key: 'removeTag',
      accept: () => {
        this.dataService
          .removeTagFromCandidate(
            this.candidateId,
            (this.candidate.tags as any)[index]
          )
          .subscribe((data) => {
            this.candidate.tags?.splice(index, 1);
          });
      },
      reject: () => {
        //reject action
      },
    });
  }

  getCandidate() {
    return this.dataService.allCandidates.find(
      (c) => c.id == this.candidateId
    ) as Candidate;
  }

  onSidebarShow() {
    (document.querySelector('.p-sidebar-content') as any).style.padding = '0';
  }

  addTagToCandidate() {
    let tag = this.newTag.removeExtraSpaces();
    if (
      this.newTag.trim() &&
      !this.candidate.tags?.find(
        (tag) =>
          tag.toLowerCase() ==
          (this.newTag as any).removeExtraSpaces().toLowerCase()
      )
    )
      this.dataService
        .addTagToCandidate(this.candidateId, tag)
        .subscribe((data) => {
          this.candidate.tags?.push(tag);
        });
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
