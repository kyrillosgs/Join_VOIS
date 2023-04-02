import { Component, OnInit } from '@angular/core';
import { Stage } from 'src/app/_models/enums/stage';
import { Topic } from 'src/app/_models/topic';
import { DataService } from 'src/app/_services/data.service';
import { Question } from 'src/app/_models/question';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  protected topics: { stage: string; stageName: any; topics: Topic[] }[] = [];
  selectedTopicId!: any;
  selectedTopicQuestions!: Question[];
  stages: any[] = [];
  addTopicForm!: FormGroup;
  addQuestionForm!: FormGroup;

  tfdisplay: boolean = false;
  tferror!: string;
  tfloading: boolean = false;
  tfsubmitted: boolean = false;

  qfdisplay: boolean = false;
  qferror!: string;
  qfloading: boolean = false;
  qfsubmitted: boolean = false;

  addQuestion() {
    this.qfsubmitted = true;
    if (this.addQuestionForm.invalid) return;
    this.qfloading = true;
    let q = new Question(
      0,
      this.qf['Text'].value,
      this.qf['Answer'].value,
      this.selectedTopicId
    );
    this.dataService.addQuestion(q).subscribe(
      (data) => {
        if (data.id) {
          this.qferror = '';
          this.qfloading = false;
          q.id = data.id;
          this.selectedTopicQuestions.push(q);
          // this.topics = Array.from(this.topics);
          // this.topics.find((tt) => tt.stage == (t.type as any))?.topics.push(t);
          this.cancelNewQuestion();
        } else {
          this.qferror = data.errors.name;
          this.qfloading = false;
        }
      },
      (error) => {
        this.tferror = error;
        this.tfloading = false;
      }
    );
  }

  cancelNewQuestion() {
    this.addQuestionForm.reset({ Topic: this.selectedTopicId });
    this.qfdisplay = false;
    this.qfloading = false;
    this.qferror = '';
    this.qfsubmitted = false;
  }

  addTopic() {
    this.tfsubmitted = true;
    if (this.addTopicForm.invalid) return;
    this.tfloading = true;
    let t = new Topic(
      0,
      this.tf['Name'].value,
      undefined,
      undefined,
      this.tf['Stage'].value
    );
    this.dataService.addTopic(t).subscribe(
      (data) => {
        if (data.id) {
          this.tferror = '';
          this.tfloading = false;
          t.id = data.id;
          this.dataService.allTopics.push(t);
          this.topics = Array.from(this.topics);
          this.topics.find((tt) => tt.stage == (t.type as any))?.topics.push(t);
          this.cancelNewTopic();
        } else {
          this.tferror = data.errors.name;
          this.tfloading = false;
        }
      },
      (error) => {
        this.tferror = error;
        this.tfloading = false;
      }
    );
  }

  cancelNewTopic() {
    this.addTopicForm.reset();
    this.tfdisplay = false;
    this.tfloading = false;
    this.tferror = '';
    this.tfsubmitted = false;
  }

  constructor(
    protected dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    Object.keys(Stage)
      .filter((s: any) => isNaN(s))
      .forEach((s) => {
        this.stages.push({
          optionLabel: (s.replace('_', ' ') as any).capitalizeEachWord(),
          optionValue: s,
        });
      });
  }

  ngOnInit(): void {
    this.addTopicForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Stage: ['', [Validators.required]],
    });
    this.addQuestionForm = this.formBuilder.group({
      Text: ['', [Validators.required, Validators.minLength(10)]],
      Answer: ['', [Validators.required, Validators.minLength(10)]],
      Topic: [this.selectedTopicId, [Validators.required]],
    });
    this.qf['Topic'].disable();
    this.dataService.getAllTopics().subscribe((data) => {
      this.dataService.allTopics = data;
      this.dataService.allTopics
        .sort((a, b) => {
          if ((a.type as any) > (b.type as any)) return 1;
          else if ((a.type as any) < (b.type as any)) return -1;
          return 0;
        })
        .forEach((t) => {
          if (
            !this.topics.find((tt) => tt.stage == (t.type as any)) &&
            (Stage as any)[t.type as any] !== undefined
          ) {
            this.topics.push({
              stage: t.type as any,
              stageName: (t.type as any)
                .replaceAll('_', ' ')
                .capitalizeEachWord(),
              topics: [],
            });
          }
          this.topics.find((tt) => tt.stage == (t.type as any))?.topics.push(t);
        });
    });
  }

  protected get tf() {
    return this.addTopicForm.controls;
  }

  protected get qf() {
    return this.addQuestionForm.controls;
  }

  changeTopic(e: any) {
    this.selectedTopicQuestions = [];
    this.dataService.getAllQuestions().subscribe((data) => {
      this.selectedTopicQuestions.push(
        ...data.filter((q) => q.topics_id == e.value)
      );
    });
    this.qf['Topic'].setValue(this.selectedTopicId);
  }

  protected get noQuestions(): boolean {
    return this.selectedTopicQuestions.length > 0;
  }

  protected get selectedTopic(): Topic {
    return this.dataService.allTopics.find(
      (t) => t.id == this.selectedTopicId
    ) as Topic;
  }
}
