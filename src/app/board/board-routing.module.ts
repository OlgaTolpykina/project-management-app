import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardListComponent } from './pages/board-list/board-list.component';
import { NotFoundComponent } from '@shared/not-found/not-found.component';
import { BoardsResolver } from '@board/resolvers/boards.resolver';

const routes: Routes = [
  {
    path: '',
    component: BoardListComponent,
    pathMatch: 'full',
    resolve: { boards: BoardsResolver },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardRoutingModule {}
