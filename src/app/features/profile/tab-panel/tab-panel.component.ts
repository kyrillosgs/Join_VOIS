import { Component, OnInit, Input } from '@angular/core';
import { Candidate } from 'src/app/_models/candidate';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.css'],
})
export class TabPanelComponent implements OnInit {
  @Input() candidate!: Candidate;

  scrollableTabs = this.dataService.getStages();

  constructor(public dataService: DataService) {}

  ngOnInit() {}

  //scrollableTabs: any[] = Array.from({ length: 50 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` }));
}
