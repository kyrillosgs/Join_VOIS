import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Candidate } from 'src/app/_models/candidate';
import { Stage } from 'src/app/_models/enums/stage';
import { State } from 'src/app/_models/enums/state';
import { Interview } from 'src/app/_models/interview';
import { Question } from 'src/app/_models/question';
import { Topic } from 'src/app/_models/topic';
import { User } from 'src/app/_models/user';
import { DataService } from 'src/app/_services/data.service';
import { ProfileComponent } from '../profile.component';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.scss'],
})
export class TabPanelComponent implements OnInit {
  @ViewChild('addAssignee') public addAssignee!: ElementRef;
  @Input() candidate!: Candidate;
  @Input() interviews!: Interview[];
  allStages: any[] = [];
  allUsers: {
    tid: number | undefined;
    tname: string | undefined;
    users: User[];
  }[] = [];
  public topics!: Topic[];
  public questions!: Question[];
  public assignees!: User[];
  hoveredTag!: number;
  addingTag!: boolean;
  newTag!: any;
  editingNotes: boolean = false;

  generateQuestionsForm!: FormGroup;
  selectedTopicQuestions!: Question[];
  fdisplay: boolean = false;
  ferror!: string;
  floading: boolean = false;
  fsubmitted: boolean = false;
  selectedQuestions: Question[] = [];

  removeQuestion(e: any, id: number) {
    this.selectedQuestions.splice(
      this.selectedQuestions.findIndex((q) => q.id == id),
      1
    );
  }

  changeTopic(e: any) {
    this.selectedTopicQuestions = [];
    this.dataService.getAllQuestions().subscribe((data) => {
      this.selectedTopicQuestions = data.filter((q) => q.topics_id == e.value);
      let sq = this.dataService.selectedInterview.questions
        .filter((q) => q.topics_id == e.value)
        .map((s) => s.id);
      this.selectedQuestions = this.selectedTopicQuestions.filter(
        (s) => sq.indexOf(s.id) > -1
      );
    });
  }

  generateQuestions() {
    this.fsubmitted = true;
    if (this.generateQuestionsForm.invalid) return;
    this.floading = true;
    let q = {
      question_ids: this.selectedQuestions.map((i: Question) => i.id),
      topic_id: this.f['Topic'].value,
      interview_id: this.dataService.selectedInterview.id,
    };
    this.dataService.addQuestionsToInterview(q).subscribe(
      (data) => {
        this.ferror = '';
        this.floading = false;
        let idsToRemove = this.dataService.selectedInterview.questions
          .filter(
            (qq) =>
              !q.question_ids.includes(qq.id) && qq.topics_id == q.topic_id
          )
          .map((qq, i) => i);
        idsToRemove.forEach((i) => {
          this.dataService.selectedInterview.questions.splice(i, 1);
        });
        let questionsToAdd = this.selectedQuestions.filter(
          (qq) =>
            !this.dataService.selectedInterview.questions.find(
              (qqq) => qqq.id == qq.id
            )
        );
        this.dataService.selectedInterview.questions.push(...questionsToAdd);
        // push(
        //   ...this.selectedQuestions
        // );
        this.questions = JSON.parse(
          JSON.stringify(this.dataService.selectedInterview.questions)
        );
        this.cancelQuestionsGeneration();
      },
      (error) => {
        this.ferror = error;
        this.floading = false;
      }
    );
  }

  cancelQuestionsGeneration() {
    this.generateQuestionsForm.reset();
    this.selectedQuestions = [];
    this.selectedTopicQuestions = [];
    this.fdisplay = false;
    this.floading = false;
    this.ferror = '';
    this.fsubmitted = false;
  }

  updateNotes(id: number) {
    this.dataService
      .editInterviewTopic(this.dataService.selectedInterview.id, id, {
        notes: (this.topics.find((t) => t.id == id) as Topic).note,
      })
      .subscribe((data) => {
        (
          this.dataService.selectedInterview.topics.find(
            (t) => t.id == id
          ) as any
        ).note = (this.topics.find((t) => t.id == id) as any).note;
      });
    this.editingNotes = false;
  }

  revertNotes(id: number) {
    (this.topics.find((t) => t.id == id) as Topic).note = (
      this.dataService.selectedInterview.topics.find((t) => t.id == id) as Topic
    ).note;
  }

  editNotes() {
    this.editingNotes = true;
  }

  confirmTopicScoreChange(newScore: number, id: number) {
    if (
      newScore !=
      this.dataService.selectedInterview.topics.find((t) => t.id == id)?.score
    )
      this.confirmationService.confirm({
        message: 'Update topic score?',
        target: document.querySelector('#tscore' + id) as any,
        icon: 'pi pi-exclamation-triangle text-warning',
        key: 'removeAssignee',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.dataService
            .editInterviewTopic(this.dataService.selectedInterview.id, id, {
              score: (this.topics.find((t) => t.id == id) as Topic).score,
            })
            .subscribe((data) => {
              (
                this.dataService.selectedInterview.topics.find(
                  (t) => t.id == id
                ) as any
              ).score = newScore;
            });
        },
        reject: () => {
          (this.topics.find((t) => t.id == id) as any).score = (
            this.dataService.selectedInterview.topics.find(
              (t) => t.id == id
            ) as any
          ).score;
        },
      });
  }

  confirmQuestionScoreChange(newScore: number, id: number) {
    if (
      newScore !=
      this.dataService.selectedInterview.questions.find((q) => q.id == id)
        ?.score
    )
      this.confirmationService.confirm({
        message: 'Update question score?',
        target: document.querySelector('#qscore' + id) as any,
        icon: 'pi pi-exclamation-triangle text-warning',
        key: 'removeAssignee',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.dataService
            .editInterviewQuestion(this.dataService.selectedInterview.id, id, {
              score: newScore,
            })
            .subscribe((data) => {
              (
                this.dataService.selectedInterview.questions.find(
                  (q) => q.id == id
                ) as Question
              ).score = newScore;
            });
        },
        reject: () => {
          (this.questions.find((q) => q.id == id) as Question).score =
            this.dataService.selectedInterview.questions.find((q) => q.id == id)
              ?.score as number;
        },
      });
  }

  getScoreColor(id: number, property: string) {
    return (this as any)[property].find((p: Topic | Question) => p.id == id)
      .score >= 50
      ? '#34A835'
      : '#e91224';
  }

  confirmAssigneeRemoval(event: any, index: number) {
    this.confirmationService.confirm({
      target: event.target as any,
      message:
        'Remove Assignee "' +
        (this.dataService.selectedInterview.assignees as any)[index].name +
        '"?',
      icon: 'pi pi-exclamation-triangle',
      key: 'removeAssignee',
      accept: () => {
        this.dataService
          .removeAssigneeFromInterview(
            this.dataService.selectedInterview.id,
            index
          )
          .subscribe((data) => {
            this.dataService.selectedInterview.assignees.splice(index, 1);
          });
      },
      reject: () => {
        //reject action
      },
    });
  }

  addAssigneeToInterview() {
    let assignee: any;
    this.allUsers.forEach((t) => {
      if (t.users.find((u) => u.id == this.newTag))
        assignee = t.users.find((u) => u.id == this.newTag);
    });
    if (
      assignee &&
      !this.dataService.selectedInterview.assignees.find(
        (a) => a.id == assignee.id
      )
    ) {
      this.dataService
        .addAssigneeToInterview(
          this.dataService.selectedInterview.id,
          assignee.id
        )
        .subscribe((data) => {
          this.dataService.selectedInterview.assignees.push(assignee);
        });
    }
    this.addingTag = false;
    this.newTag = '';
  }

  addAssigneeClick() {
    this.addAssignee.nativeElement.classList.add('p-input-icon-right');
    this.addingTag = true;
    window.setTimeout(() => {
      try {
        this.addAssignee.nativeElement.querySelector('.add-tag-input').focus();
      } catch {}
    }, 100);
  }

  constructor(
    public dataService: DataService,
    public confirmationService: ConfirmationService,
    private profileComponent: ProfileComponent,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    if (this.dataService.selectedInterview) {
      this.topics = JSON.parse(
        JSON.stringify(this.dataService.selectedInterview.topics)
      );
      this.questions = JSON.parse(
        JSON.stringify(this.dataService.selectedInterview.questions)
      );
      this.assignees = this.dataService.selectedInterview.assignees;
      for (let i in Stage)
        if (
          isNaN(i as any) &&
          this.interviews.find((ii) => (ii.type as any) == i)
        )
          this.allStages.push({
            optionLabel: (i.replaceAll('_', ' ') as any).capitalizeEachWord(),
            optionValue: i,
          });
    }
    this.dataService.getAllUsers().subscribe(
      (data) => {
        data.data
          .sort((a, b) => (a.team_id?.id as any) - (b.team_id?.id as any))
          .forEach((u) => {
            if (!this.allUsers.find((t) => t.tid == u.team_id?.id))
              this.allUsers.push({
                tid: u.team_id?.id,
                tname: u.team_id?.name,
                users: [],
              });
            this.allUsers.find((t) => t.tid == u.team_id?.id)?.users.push(u);
          });
      },
      (error) => {}
    );
    this.generateQuestionsForm = this.formBuilder.group({
      Topic: ['', [Validators.required]],
      Questions: [''],
    });
  }

  protected get activeIndex() {
    return this.allStages.findIndex(
      (s) => s.optionValue == this.dataService.selectedInterview.type
    );
  }

  changeStage(e: any) {
    this.dataService.selectedInterview = this.interviews.find(
      (i) => i.type == this.allStages[e].optionValue
    ) as Interview;
    this.topics = JSON.parse(
      JSON.stringify(this.dataService.selectedInterview.topics)
    );
    this.questions = JSON.parse(
      JSON.stringify(this.dataService.selectedInterview.questions)
    );
    this.assignees = this.dataService.selectedInterview.assignees;
    this.addingTag = false;
    this.newTag = '';
    this.profileComponent.refreshStage();
  }

  getTopicQuestions(topic_id: number) {
    return this.questions.filter((q) => q.topics_id == topic_id);
  }

  protected get f() {
    return this.generateQuestionsForm.controls;
  }
}
