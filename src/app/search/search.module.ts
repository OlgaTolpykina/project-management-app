import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchingPageComponent } from './pages/searching-page/searching-page.component';
import { TasksModule } from '@tasks/tasks.module';

@NgModule({
  declarations: [SearchingPageComponent],
  imports: [CommonModule, SearchRoutingModule, SharedModule, TasksModule],
  exports: [SharedModule],
})
export class SearchModule {}
