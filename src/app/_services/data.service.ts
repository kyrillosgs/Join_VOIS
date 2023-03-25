import { Injectable } from '@angular/core';
import { Board } from '../_models/board';
import { Column } from '../_models/column';
import { Candidate } from '../_models/candidate';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State } from '../_models/enums/state';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public allCandidates: Candidate[] = [];
  drawBoard(): void {
    this.allCandidates.sort((a: Candidate, b: Candidate) => {
      if ((a.state as any) > (b.state as any)) return 1;
      if ((a.state as any) < (b.state as any)) return -1;
      return 0;
    });
    this._kanbanModal.columns = Array.from([
      new Column(
        State.pending_review,
        this.allCandidates.filter((c) => c.state == 'pending_review')
      ),
      new Column(
        State.phone_screening,
        this.allCandidates.filter((c) => c.state == 'phone_screening')
      ),
      new Column(
        State.technical_interview,
        this.allCandidates.filter((c) => c.state == 'technical_interview')
      ),
      new Column(
        State.manager_interview,
        this.allCandidates.filter((c) => c.state == 'manager_interview')
      ),
      new Column(
        State.customer_interview,
        this.allCandidates.filter((c) => c.state == 'customer_interview')
      ),
      new Column(
        State.hr_interview,
        this.allCandidates.filter((c) => c.state == 'hr_interview')
      ),
    ]);
  }

  constructor(private http: HttpClient) {}

  private _kanbanModal: Board = new Board(
    'ServiceNow Team - DevOps & Cloud CoE',
    []
  );

  public getAllCandidates(id: number) {
    return this.http.get<{ data: Candidate[] }>(
      environment.apiURL + 'api/candidates/get_candidates_by_team/' + id
    );
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
}
