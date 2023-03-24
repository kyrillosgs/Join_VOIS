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

  public getAllCandidates() {
    return this.http.get<{ data: Candidate[] }>(
      environment.apiURL + 'api/candidates',
      {
        headers: {
          authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2hpcmluZy10b29sLmFobWVkc2FsZWgubmV0L2FwaS9sb2dpbiIsImlhdCI6MTY3OTYxOTc1NiwiZXhwIjoxNjc5NjIzMzU2LCJuYmYiOjE2Nzk2MTk3NTYsImp0aSI6IjZSY1d1Q09tTEZhZkNtSXoiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.bQtwXCeSAPg1RvUtnP2123R7QxJR5yu__QKBvMpVc_U',
        },
      }
    );
  }

  public getAttachment(url: string) {
    return this.http.get<any>(environment.apiURL + url, {
      headers: new HttpHeaders({
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2hpcmluZy10b29sLmFobWVkc2FsZWgubmV0L2FwaS9sb2dpbiIsImlhdCI6MTY3OTYxOTc1NiwiZXhwIjoxNjc5NjIzMzU2LCJuYmYiOjE2Nzk2MTk3NTYsImp0aSI6IjZSY1d1Q09tTEZhZkNtSXoiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.bQtwXCeSAPg1RvUtnP2123R7QxJR5yu__QKBvMpVc_U',
        'Access-Control-Allow-Origin': '*',
      }),
    });
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
}
