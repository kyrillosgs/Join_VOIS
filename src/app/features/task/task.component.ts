import { Candidate } from 'src/app/_models/candidate';
import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { BehaviorSubject } from 'rxjs';
import { RedirectGuard } from 'src/app/_helpers/redirect.guard';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  host: {
    class: 'candidate',
  },
})
export class TaskComponent implements OnInit {
  @Input()
  candidate!: Candidate;
  constructor(
    public dataService: DataService,
    public redirectGuard: RedirectGuard
  ) {}
  ngOnInit(): void {}
  public get Id(): number {
    return (<Candidate>this.candidate).id;
  }
}
