import { Component, OnInit, OnDestroy } from '@angular/core';

import { SearchService } from '@shared/services/search.service';

@Component({
  selector: 'app-searching-page',
  templateUrl: './searching-page.component.html',
  styleUrls: ['./searching-page.component.scss'],
})
export class SearchingPageComponent implements OnInit, OnDestroy {
  constructor(public searchService: SearchService) {}

  ngOnInit(): void {
    this.searchService.getAllTasks();
    this.searchService.selectedTask = null;
    this.searchService.isTaskRequestNeed = false;
  }

  ngOnDestroy(): void {
    this.searchService.isTaskRequestNeed = true;
    this.searchService.openPage = false;
  }
}
