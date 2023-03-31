import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Candidate } from 'src/app/_models/candidate';
import { Stage } from 'src/app/_models/enums/stage';
import { State } from 'src/app/_models/enums/state';
import { Interview } from 'src/app/_models/interview';
import { Question } from 'src/app/_models/question';
import { Topic } from 'src/app/_models/topic';
import { User } from 'src/app/_models/user';
import { DataService } from 'src/app/_services/data.service';

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
        // this.dataService
        //   .removeTagFromCandidate(
        //     this.candidate.id,
        //     (this.candidate.tags as any)[index]
        //   )
        //   .subscribe((data) => {
        //     this.candidate.tags?.splice(index, 1);
        //   });
        this.dataService.selectedInterview.assignees.splice(index, 1);
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
      // this.dataService
      //   .addTagToCandidate(this.candidate.id, tag)
      //   .subscribe((data) => {
      //     this.candidate.tags?.push(tag);
      //   });
      this.dataService.selectedInterview.assignees.push(assignee);
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
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.topics = this.dataService.selectedInterview.topics;
    this.questions = this.dataService.selectedInterview.questions;
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
    this.topics = this.dataService.selectedInterview.topics;
    this.questions = this.dataService.selectedInterview.questions;
    this.assignees = this.dataService.selectedInterview.assignees;
    this.addingTag = false;
    this.newTag = '';
  }

  getTopicQuestions(topic_id: number) {
    return this.questions.filter((q) => q.topic_id == topic_id);
  }

  //scrollableTabs: any[] = Array.from({ length: 50 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` }));
}
