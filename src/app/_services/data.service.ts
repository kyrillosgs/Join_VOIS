import { Injectable } from '@angular/core';
import { Board } from '../_models/board';
import { Column } from '../_models/column';
import { Candidate } from '../_models/candidate';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State } from '../_models/enums/state';
import { AuthService } from './auth.service';
import { User } from '../_models/user';
import { Team } from '../_models/team';
import { Interview } from '../_models/interview';
import { Position } from '../_models/position';
import { Subject, BehaviorSubject } from 'rxjs';
import { Topic } from '../_models/topic';
import { Question } from '../_models/question';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public allCandidates: Candidate[] = [];
  public loggedInUser!: User;
  public selectedTeamsCache: Team[] = [];
  public selectedInterview!: Interview;
  public allPositions: Position[] = [];
  public allTopics: Topic[] = [];

  public selectedTeamsBS = new BehaviorSubject(this.selectedTeamsCache);
  public allPositionsBS = new BehaviorSubject(this.allPositions);

  drawBoard(): void {
    this.allCandidates.sort((a: Candidate, b: Candidate) => {
      if ((a.state as any) > (b.state as any)) return 1;
      if ((a.state as any) < (b.state as any)) return -1;
      return 0;
    });
    this._kanbanModal.columns = Array.from([
      new Column(
        State.pending_review,
        this.allCandidates.filter((c) => c.state == Object.keys(State)[0])
      ),
      new Column(
        State.phone_screening,
        this.allCandidates.filter((c) => c.state == Object.keys(State)[1])
      ),
      new Column(
        State.technical_interview,
        this.allCandidates.filter((c) => c.state == Object.keys(State)[2])
      ),
      new Column(
        State.manager_interview,
        this.allCandidates.filter((c) => c.state == Object.keys(State)[3])
      ),
      new Column(
        State.customer_interview,
        this.allCandidates.filter((c) => c.state == Object.keys(State)[4])
      ),
      new Column(
        State.hr_interview,
        this.allCandidates.filter((c) => c.state == Object.keys(State)[5])
      ),
    ]);
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loggedInUser = authService.getTokenDataAfterDecode()?.user;
    this.getAllPositions().subscribe((data) => {
      this.allPositions = data;
      this.allPositionsBS.next(this.allPositions);
    });
  }

  private stages: string[] = [
    'Phone screening',
    'Technical Interview',
    'Manager Interview',
    'Customer Interview',
  ];

  private _kanbanModal: Board = new Board(
    'ServiceNow Team - DevOps & Cloud CoE',
    []
  );

  public getAllCandidates(id: number) {
    return this.http.get<{ data: Candidate[] }>(
      environment.apiURL + 'api/candidates/get_candidates_by_team/' + id
    );
  }

  public getAllTeams() {
    return this.http.get<Team[]>(environment.apiURL + 'api/teams');
  }

  public getCandidate(id: number) {
    return this.http.get<{ data: Candidate }>(
      environment.apiURL + 'api/candidates/candidate/' + id
    );
  }

  public getCV(id: number) {
    return this.http.get<any>(
      environment.apiURL + 'api/candidates/candidate_cv/' + id,
      { responseType: 'arraybuffer' as any }
    );
  }

  public getData(): Board {
    return this._kanbanModal;
  }

  //Stages>>
  public getStages(): string[] {
    return this.stages;
  }

  // public moveToNextStage(selectedStageCode:number){
  //   this.selectedStage = <Istage>this.stages.find( (stage) => stage.code == selectedStageCode+1);
  // }

  //<<Stages end...

  addTopic(topic: Topic) {
    return this.http.post<any>(environment.apiURL + 'api/topics/create', topic);
  }

  addQuestion(question: Question) {
    return this.http.post<any>(
      environment.apiURL + 'api/questions/create',
      question
    );
  }

  addCandidate(candidate: Candidate) {
    return this.http.post<any>(
      environment.apiURL + 'api/candidates/create',
      candidate
    );
  }

  editCandidate(id: number, update: object) {
    return this.http.post<any>(
      environment.apiURL + 'api/candidates/edit/' + id,
      update
    );
  }

  addTagToCandidate(candidate_id: number, tag_name: string) {
    return this.http.post<any>(
      environment.apiURL + 'api/candidates/add_tag_to_candidate',
      { candidate_id, tag_name }
    );
  }

  removeTagFromCandidate(candidate_id: number, tag_name: string) {
    return this.http.post<any>(
      environment.apiURL + 'api/candidates/delete_tag_to_candidate',
      { candidate_id, tag_name }
    );
  }

  getUser(id: number) {
    return this.http.get<{ data: User }>(
      environment.apiURL + 'api/users/user/' + id
    );
  }

  getAllUsers() {
    return this.http.get<{ data: User[] }>(environment.apiURL + 'api/users');
  }

  getAllPositions() {
    return this.http.get<Position[]>(environment.apiURL + 'api/positions');
  }

  getAllTopics() {
    return this.http.get<Topic[]>(environment.apiURL + 'api/topics');
  }

  getAllQuestions() {
    return this.http.get<Question[]>(environment.apiURL + 'api/questions');
  }

  getPositionTopics(id: number) {
    return this.http.get<Topic[]>(
      environment.apiURL + 'api/topics/get_all_topics_by_position/' + id
    );
  }

  getCandidateInterviews(id: number) {
    return this.http.get<{ data: Interview[] }>(
      environment.apiURL + 'api/interviews/get_interview_to_candidate/' + id
    );
  }

  addAssigneeToInterview(interview_id: number, user_id: number) {
    return this.http.post<any>(
      environment.apiURL + 'api/interviews/add_assignee_to_interview',
      { interview_id, user_id }
    );
  }

  removeAssigneeFromInterview(interview_id: number, user_id: number) {
    return this.http.post<any>(
      environment.apiURL + 'api/interviews/delete_assignee_to_interview',
      { interview_id, user_id }
    );
  }

  editInterview(interview_id: number, update: Object) {
    return this.http.post<any>(
      environment.apiURL + 'api/interviews/edit/' + interview_id,
      update
    );
  }

  editInterviewTopic(interview_id: number, topics_id: number, update: Object) {
    return this.http.post<any>(
      environment.apiURL + 'api/interviews/update_interview_topics',
      { ...update, interview_id, topics_id }
    );
  }

  editInterviewQuestion(
    interview_id: number,
    question_id: number,
    update: Object
  ) {
    return this.http.post<any>(
      environment.apiURL + 'api/interviews/update_interview_question',
      { ...update, interview_id, question_id }
    );
  }
}
