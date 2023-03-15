import { Injectable } from '@angular/core';
import { Board } from '../_models/board';
import { Column } from '../_models/column';
import { Candidate } from '../_models/candidate';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private _kanbanModal: Board = new Board(
    'ServiceNow Team - DevOps & Cloud CoE',
    [
      new Column('Pending Review', [
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
        new Candidate(
          128,
          'Esther Howard',
          'esther.howard@abc.com',
          '0123456789',
          'Design'
        ),
        new Candidate(
          127,
          'Ralph Edwards',
          'ralph.edwards@abc.com',
          '0123456789',
          'Engineer'
        ),
        new Candidate(
          130,
          'Jamie Lewis',
          'jamie.lewis123312314dokof@dwkdok.com',
          '012379874932',
          'Servicenow Developer'
        ),
      ]),
      new Column('Phone Screening', [
        new Candidate(
          125,
          'AbdElrahmanderfwre Elarnaouty',
          'cameron.williamson@abc.com',
          '0123456789',
          'ServiceNow Architect'
        ),
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
      ]),
      new Column('Technical Interview', [
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
      ]),
      new Column('Manager Interview', [
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
      ]),
      new Column('Customer Interview', [
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
      ]),
      new Column('HR Interview', [
        new Candidate(
          125,
          'Cameron Williamson',
          'cameron.williamson@abc.com',
          '0123456789',
          'Sales'
        ),
      ]),
    ]
  );

  public getData(): Board {
    return this._kanbanModal;
  }
}
