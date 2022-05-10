import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { SearchService } from '@shared/services/search.service';

@Component({
  selector: 'app-searching-page',
  templateUrl: './searching-page.component.html',
  styleUrls: ['./searching-page.component.scss'],
})
export class SearchingPageComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  constructor(public searchService: SearchService) {}

  ngOnInit(): void {
    this.searchService.getAllTasks();
    this.searchService.selectedTask = null;
    this.searchService.isTaskRequestNeed = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
    this.searchService.isTaskRequestNeed = true;
  }
}
