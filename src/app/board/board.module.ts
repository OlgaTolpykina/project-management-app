import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardItemComponent } from './components/board-item/board-item.component';
import { BoardListComponent } from './pages/board-list/board-list.component';
import { SharedModule } from '@shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  declarations: [BoardItemComponent, BoardListComponent],
  imports: [CommonModule, SharedModule, BoardRoutingModule],
})
export class BoardModule {}
