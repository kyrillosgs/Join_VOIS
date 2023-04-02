import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { Candidate } from 'src/app/_models/candidate';
import { Result } from 'src/app/_models/enums/result';
import { Stage } from 'src/app/_models/enums/stage';
import { Interview } from 'src/app/_models/interview';
import { Question } from 'src/app/_models/question';
import { Topic } from 'src/app/_models/topic';
import { User } from 'src/app/_models/user';
import { DataService } from 'src/app/_services/data.service';
import { CandidateStateComponent } from './candidate-state/candidate-state.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(CandidateStateComponent)
  candidateStateComponent!: CandidateStateComponent;
  private candidateId!: number;
  protected candidate!: Candidate;
  public destroyed = new Subject<any>();
  public interviews: Interview[] = [];
  //   [
  //     new Interview(
  //       1,
  //       new Date(),
  //       this.candidateId,
  //       (Stage as any)[1],
  //       (Result as any)[1],
  //       [
  //         new Topic(1, 'OOP', 80, ''),
  //         new Topic(2, 'Javascript', 75, 'Backend oriented.'),
  //         new Topic(3, 'Databases', 90, 'Very good DB skills.'),
  //         new Topic(4, 'Web Architecture', 85),
  //       ],
  //       [new User(45, 'Ahmed Ayoub'), new User(22, 'Islam Ibrahim')],
  //       [
  //         new Question(
  //           1,
  //           'What are the four pillars of OOP?',
  //           'Polymorphism, encapsulation, abstraction and inheritance',
  //           1,
  //           80
  //         ),
  //         new Question(
  //           2,
  //           'What is the difference between a class and an object?',
  //           'Object is an instance of a class. Class is a blueprint or template from which objects are created. Object is a real world entity such as pen, laptop, mobile, bed, keyboard, mouse, chair etc. Class is a group of similar objects.',
  //           1,
  //           70
  //         ),
  //         new Question(
  //           3,
  //           'What do you know about callbacks?',
  //           'A function which is to be executed after another function has finished execution. A more formal definition would be - Any function that is passed as an argument to another function so that it can be executed in that other function is called as a callback function.',
  //           2,
  //           75
  //         ),
  //         new Question(
  //           4,
  //           'duplicate([1, 2, 3, 4, 5]); // [1,2,3,4,5,1,2,3,4,5]',
  //           `function duplicate(arr) {
  //   return arr.concat(arr);
  // }

  // duplicate([1, 2, 3, 4, 5]); // [1,2,3,4,5,1,2,3,4,5]`,
  //           2,
  //           90
  //         ),
  //         new Question(
  //           5,
  //           `console.log(mul(2)(3)(4)); // output : 24
  // console.log(mul(4)(3)(4)); // output : 48`,
  //           `function mul (x) {
  //   return function (y) { // anonymous function
  //     return function (z) { // anonymous function
  //       return x * y * z;
  //     };
  //   };
  // }`,
  //           2,
  //           85
  //         ),
  //         new Question(
  //           6,
  //           'What is an aggregate function?',
  //           'In database management, an aggregate function or aggregation function is a function where the values of multiple rows are grouped together to form a single summary value.',
  //           3,
  //           90
  //         ),
  //         new Question(
  //           7,
  //           'What do you know about normalization?',
  //           'Normalization is a database design technique that reduces data redundancy and eliminates undesirable characteristics like Insertion, Update and Deletion Anomalies. Normalization rules divides larger tables into smaller tables and links them using relationships. The purpose of Normalisation in SQL is to eliminate redundant (repetitive) data and ensure data is stored logically.',
  //           3,
  //           85
  //         ),
  //         new Question(
  //           8,
  //           'What are middlewares?',
  //           'A middleware is a function that will have all the access for requesting an object, responding to an object, and moving to the next middleware function in the application request-response cycle.',
  //           4,
  //           70
  //         ),
  //         new Question(
  //           9,
  //           'What is MVC?',
  //           'The Model-View-Controller (MVC) is an architectural pattern that separates an application into three main logical components: the model, the view, and the controller. Each of these components are built to handle specific development aspects of an application.',
  //           4,
  //           75
  //         ),
  //       ],
  //       82,
  //       'Good communication with a very good English level.\nNeeds improvement in front-end technologies.\nVery good in databases.'
  //     ),
  //     new Interview(
  //       1,
  //       new Date(),
  //       this.candidateId,
  //       (Stage as any)[2],
  //       (Result as any)[0],
  //       [new Topic(5, 'Agile'), new Topic(6, 'Teamwork')],
  //       [new User(32, 'Hossam Ismail')],
  //       [
  //         new Question(
  //           10,
  //           'What are the main agile ceremonies?',
  //           `Sprint Planning
  // Daily Stand-Up
  // Sprint Review
  // Sprint Retrospective`,
  //           5
  //         ),
  //         new Question(
  //           11,
  //           'What are the common agile methodologies?',
  //           'Scrum, eXtreme Programming (XP), Feature Driven Development (FDD), Dynamic Systems Development Method (DSDM), Adaptive Software Development (ASD), Crystal, and Lean Software Development (LSD).',
  //           5
  //         ),
  //         new Question(
  //           12,
  //           'What is the difference between agile and waterfall?',
  //           'The main difference is that Waterfall is a linear system of working that requires the team to complete each project phase before moving on to the next one while Agile encourages the team to work simultaneously on different phases of the project.',
  //           5
  //         ),
  //         new Question(
  //           13,
  //           'Describe a group project you worked on. What was your role and what did you achieve?',
  //           `Varying answers.`,
  //           6
  //         ),
  //         new Question(
  //           14,
  //           `Has your team ever failed to reach a goal? If so, what went wrong and what did you learn from that experience?`,
  //           'Varying answer.',
  //           6
  //         ),
  //         new Question(
  //           15,
  //           'What work habits promote team spirit?',
  //           'e.g. regular meetings, cross-departmental projects, team-bonding activities',
  //           6
  //         ),
  //       ],
  //       76,
  //       'Good English level.\nWorked only with Kanban agile model.\nTeam player.'
  //     ),
  //   ];

  constructor(
    protected dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    route.params.subscribe((params) => {
      this.candidateId = params['id'];
    });
  }
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntil(this.destroyed)
      )
      .subscribe(() => {
        // this.retrieveInterviews();
        // this.changeDetectorRef.detectChanges();
      });
    this.retrieveInterviews();
  }

  retrieveInterviews() {
    (this.dataService.selectedInterview as any) = undefined;
    this.dataService
      .getCandidateInterviews(this.candidateId)
      .subscribe((data) => {
        this.interviews = data.data;
        this.dataService.getCandidate(this.candidateId).subscribe(
          (data) => {
            this.candidate = data.data;
            this.dataService.selectedInterview =
              (this.interviews.find(
                (i) => (i.type as any) == this.candidate.state
              ) as Interview) || this.interviews[0];
            setTimeout(() => {
              this.refreshStage();
            }, 100);
          },
          (error) => {}
        );
      });
  }

  refreshStage() {
    this.candidateStateComponent.initData();
  }

  ngOnDestroy(): void {
    this.destroyed.next(1);
    this.destroyed.complete();
  }
}
