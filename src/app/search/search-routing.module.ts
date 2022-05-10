import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '@shared/not-found/not-found.component';
import { SearchingPageComponent } from './pages/searching-page/searching-page.component';

const routes: Routes = [
  {
    path: '',
    component: SearchingPageComponent,
    pathMatch: 'full',
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
