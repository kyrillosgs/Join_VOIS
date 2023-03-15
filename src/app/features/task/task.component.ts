import { Candidate } from 'src/app/_models/candidate';
import { Component, Input, OnInit } from '@angular/core';

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
  taskModel!: Candidate;
  constructor() {}
  ngOnInit(): void {}
  public get Id(): number {
    return (<Candidate>this.taskModel).id;
  }
}
