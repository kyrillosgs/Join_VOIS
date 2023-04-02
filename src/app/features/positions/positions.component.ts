import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Position } from 'src/app/_models/position';
import { DataService } from 'src/app/_services/data.service';
import { filter } from 'rxjs/operators';
import { Topic } from 'src/app/_models/topic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stage } from 'src/app/_models/enums/stage';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  protected positions: { tid: number; tname: string; positions: Position[] }[] =
    [];
  selectedPositionId!: any;
  selectedPositionTopics!: Topic[];
  allTopics: { stage: string; stageName: any; topics: Topic[] }[] = [];
  addTopicForm!: FormGroup;
  addPositionForm!: FormGroup;

  tfdisplay: boolean = false;
  tferror!: string;
  tfloading: boolean = false;
  tfsubmitted: boolean = false;

  pfdisplay: boolean = false;
  pferror!: string;
  pfloading: boolean = false;
  pfsubmitted: boolean = false;

  addPosition() {
    this.pfsubmitted = true;
    if (this.addPositionForm.invalid) return;
    this.pfloading = true;
    let p = new Position(0, this.pf['Name'].value, this.pf['Team'].value);
    this.dataService.addPosition(p).subscribe(
      (data) => {
        if (data.id) {
          this.pferror = '';
          this.pfloading = false;
          p.id = data.id;
          this.dataService.allPositions.push(p);
          this.dataService.allPositionsBS.next(this.dataService.allPositions);
          this.cancelNewPosition();
        } else {
          this.pferror = data.errors.name;
          this.pfloading = false;
        }
      },
      (error) => {
        this.tferror = error;
        this.tfloading = false;
      }
    );
  }

  cancelNewPosition() {
    this.addPositionForm.reset();
    this.pfdisplay = false;
    this.pfloading = false;
    this.pferror = '';
    this.pfsubmitted = false;
  }

  addTopic() {
    this.tfsubmitted = true;
    if (this.addTopicForm.invalid) return;
    this.tfloading = true;
    let t = {
      position_id: this.tf['Position'].value,
      topics_id: this.tf['Topic'].value,
    };
    this.dataService.addTopicToPosition(t).subscribe(
      (data) => {
        if (data.id) {
          this.tferror = '';
          this.tfloading = false;
          this.selectedPositionTopics.push(
            this.dataService.allTopics.find(
              (topic) => topic.id == t.topics_id
            ) as any
          );
          // this.selectedPositionTopics = Array.from(this.selectedPositionTopics);
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
    this.addTopicForm.reset({ Position: this.selectedPositionId });
    this.tfdisplay = false;
    this.tfloading = false;
    this.tferror = '';
    this.tfsubmitted = false;
  }

  protected get tf() {
    return this.addTopicForm.controls;
  }

  protected get pf() {
    return this.addPositionForm.controls;
  }

  changePosition(e: any) {
    this.selectedPositionTopics = [];
    this.dataService.getPositionTopics(e.value).subscribe((data) => {
      this.selectedPositionTopics.push(...data);
    });
    this.tf['Position'].setValue(this.selectedPositionId);
  }

  protected get selectedPosition(): Position {
    return this.dataService.allPositions.find(
      (p) => p.id == this.selectedPositionId
    ) as Position;
  }

  constructor(
    protected dataService: DataService,
    private formBuilder: FormBuilder
  ) {
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
            !this.allTopics.find((tt) => tt.stage == (t.type as any)) &&
            (Stage as any)[t.type as any] !== undefined
          ) {
            this.allTopics.push({
              stage: t.type as any,
              stageName: (t.type as any)
                .replaceAll('_', ' ')
                .capitalizeEachWord(),
              topics: [],
            });
          }
          this.allTopics
            .find((tt) => tt.stage == (t.type as any))
            ?.topics.push(t);
        });
    });
  }

  ngOnInit(): void {
    this.addTopicForm = this.formBuilder.group({
      Position: ['', [Validators.required]],
      Topic: ['', [Validators.required]],
    });
    this.addPositionForm = this.formBuilder.group({
      Team: ['', [Validators.required]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.tf['Position'].disable();
    this.dataService.selectedTeamsBS.asObservable().subscribe((data) => {
      this.positions = [];
      this.drawPositionsList();
    });
    this.dataService.allPositionsBS.asObservable().subscribe((data) => {
      this.positions = [];
      this.drawPositionsList();
    });
  }
  drawPositionsList() {
    this.dataService.allPositions
      .sort((a, b) => a.team_id - b.team_id)
      .forEach((p) => {
        if (
          !this.positions.find((t) => t.tid == p.team_id) &&
          this.dataService.selectedTeamsCache.find((t) => t.id == p.team_id)
        )
          this.positions.push({
            tid: p.team_id,
            tname: (
              this.dataService.selectedTeamsCache.find(
                (t) => t.id == p.team_id
              ) as any
            ).name,
            positions: [],
          });
        this.positions.find((t) => t.tid == p.team_id)?.positions.push(p);
      });
  }
}
