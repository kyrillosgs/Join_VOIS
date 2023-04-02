import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterContentInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';
import { State } from 'src/app/_models/enums/state';
import { Interview } from 'src/app/_models/interview';
import { Result } from 'src/app/_models/enums/result';
import { ProfileComponent } from '../profile.component';
import { Stage } from 'src/app/_models/enums/stage';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-candidate-state',
  templateUrl: './candidate-state.component.html',
  styleUrls: ['./candidate-state.component.css'],
})
export class CandidateStateComponent implements OnInit, AfterContentInit {
  @Input() candidate!: Candidate;
  @Input() interviews!: Interview[];
  @ViewChild('notes') notes!: ElementRef;
  allStages: any[] = [];
  interviewDate!: Date;
  editingData: { date: boolean; notes: boolean } = {
    date: false,
    notes: false,
  };
  interviewScore!: number;
  interviewNotes: string | undefined;

  ngAfterContentInit(): void {
    (document.querySelector('p-calendar') as any).style.visibility = 'hidden';
    (document.querySelector('p-calendar') as any).style.position = 'absolute';
  }

  updateNotes() {
    this.editInterview(this.dataService.selectedInterview.id, {
      notes: this.interviewNotes,
    });
    this.editingData.notes = false;
  }

  editNotes() {
    this.editingData.notes = true;
    this.notes.nativeElement.focus();
  }

  confirmScoreChange(newScore: number) {
    if (newScore != this.dataService.selectedInterview.score)
      this.confirmationService.confirm({
        message: 'Update interview score?',
        target: document.querySelector('#score') as any,
        icon: 'pi pi-exclamation-triangle text-warning',
        key: 'score',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.editInterview(this.dataService.selectedInterview.id, {
            score: newScore,
          });
        },
        reject: () => {
          this.interviewScore = this.dataService.selectedInterview
            .score as number;
        },
      });
  }

  cancelDateChange() {
    this.editingData.date = false;
    this.interviewDate = new Date(this.dataService.selectedInterview.date);
  }

  setInterviewDate() {
    this.editInterview(this.dataService.selectedInterview.id, {
      date: this.interviewDate.toISOString().replace('T', ' ').replace('Z', ''),
    });
    this.editingData.date = false;
  }

  onDateChanged() {
    if (
      this.interviewDate &&
      (this.interviewDate as any) -
        (new Date(this.dataService.selectedInterview.date) as any) !=
        0
    )
      this.editingData.date = true;
  }

  onShowCalendar() {
    (
      document.querySelector(
        '.ng-trigger.ng-trigger-overlayAnimation.p-datepicker.p-component.p-datepicker-touch-ui.ng-star-inserted'
      ) as any
    ).style.visibility = 'visible';
  }

  showCalendar() {
    (
      document.querySelector('p-calendar') as any
    ).children[0].children[0].click();
  }

  moveToNextStage() {
    if ((this.candidate.state as any) == 'hr_interview')
      this.editInterview(this.currentStageInterview.id, {
        result: (Result as any)[1],
      });
    else
      this.dataService
        .editCandidate(this.candidate.id, {
          state:
            Object.keys(State)[
              Object.keys(State).indexOf(this.candidate.state as any) + 1
            ],
        })
        .subscribe((data) => {
          this.profileComponent.retrieveInterviews();
        });
  }

  confirmSuccess() {
    this.confirmationService.confirm({
      message:
        (this.candidate.state as any) != 'hr_interview'
          ? 'Move "' +
            this.candidate.name +
            `" to stage '` +
            (
              Object.keys(State)[
                Object.keys(State).indexOf(this.candidate.state as any) + 1
              ].replaceAll('_', ' ') as any
            ).capitalizeEachWord() +
            "'?"
          : 'Accept candidate "' + this.candidate.name + '"?',
      header: 'Proceed with candidate',
      icon: 'pi pi-check-square text-success',
      key: 'interview',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.moveToNextStage();
      },
      reject: () => {},
    });
  }

  confirmReject() {
    this.confirmationService.confirm({
      message: 'Reject candidate "' + this.candidate.name + '"?',
      header: 'End candidate process',
      icon: 'pi pi-exclamation-circle text-danger',
      key: 'interview',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.editInterview(this.currentStageInterview.id, { result: 'fail' });
      },
      reject: () => {},
    });
  }

  editInterview(id: number, update: any) {
    this.dataService.editInterview(id, update).subscribe(
      (data) => {
        (this.dataService.selectedInterview as any)[Object.keys(update)[0]] =
          Object.values(update)[0];
      },
      (error) => {
        (this as any)[
          'interview' + (Object.keys(update)[0] as any).capitalizeEachWord()
        ] = (this.dataService.selectedInterview as any)[Object.keys(update)[0]];
      }
    );
  }

  protected get interviewName(): string {
    return (this.dataService.selectedInterview.type as any)
      .replaceAll('_', ' ')
      .capitalizeEachWord();
  }

  protected get currentStageInterview(): Interview {
    return this.interviews.find(
      (i) => i.type == (this.candidate.state as any)
    ) as Interview;
  }

  protected get successLabel() {
    return (this.candidate.state as any) == 'hr_interview'
      ? 'Accept'
      : 'Move to next stage';
  }

  protected get successIsDisabled() {
    return (
      this.interviews.find((i) => (i.type as any) == 'hr_interview')?.result ==
        (Result as any)[1] ||
      (this.interviews.find((i) => i.type == (this.candidate.state as any))
        ?.result as any) == (Result as any)[2]
    );
  }

  protected get rejectIsDisabled() {
    return (
      this.interviews.find((i) => (i.type as any) == 'hr_interview')?.result ==
        (Result as any)[1] ||
      (this.interviews.find((i) => i.type == (this.candidate.state as any))
        ?.result as any) == (Result as any)[2] ||
      (this.candidate.state as any) == 'pending_review'
    );
  }

  protected get interviewResult() {
    return (
      this.dataService.selectedInterview.result as any
    ).capitalizeEachWord();
  }

  protected get resultClass() {
    return (this.dataService.selectedInterview.result as any) == Result[0]
      ? 'secondary'
      : (this.dataService.selectedInterview.result as any) == Result[1]
      ? 'success'
      : 'danger';
  }

  constructor(
    public dataService: DataService,
    private profileComponent: ProfileComponent,
    private confirmationService: ConfirmationService
  ) {
    for (let i in State)
      this.allStages.push({ optionLabel: (State as any)[i], optionValue: i });
  }

  initData() {
    this.interviewDate = new Date(this.dataService.selectedInterview?.date);
    this.interviewScore = this.dataService.selectedInterview?.score as number;
    this.interviewNotes = this.dataService.selectedInterview?.notes;
  }

  ngOnInit() {
    this.initData();
  }
}
