import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '@shared/not-found/not-found.component';
import { AuthorizeGuard } from './auth/guards/authorize.guard';
import { HomePageComponent } from '@core/pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [AuthorizeGuard],
    component: HomePageComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'main',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('./board/board.module').then((m) => m.BoardModule),
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
