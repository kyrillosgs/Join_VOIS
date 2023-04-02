import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Position } from 'src/app/_models/position';
import { DataService } from 'src/app/_services/data.service';
import { filter } from 'rxjs/operators';
import { Topic } from 'src/app/_models/topic';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  protected positions: { tid: number; tname: string; positions: Position[] }[] =
    [];
  selectedPosition!: any;

  changePosition(e: any) {}

  constructor(protected dataService: DataService) {}

  ngOnInit(): void {
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
