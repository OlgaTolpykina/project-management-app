import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '@shared/not-found/not-found.component';
import { AuthorizeGuard } from './auth/guards/authorize.guard';
import { HomePageComponent } from '@core/pages/home-page/home-page.component';
import { UserMessageComponent } from '@shared/user-message/user-message.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  { path: 'home', component: HomePageComponent, pathMatch: 'full' },
  { path: 'message', component: UserMessageComponent, pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'main',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('./board/board.module').then((m) => m.BoardModule),
  },
  {
    path: 'search',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'b/:id',
    loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksModule),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
