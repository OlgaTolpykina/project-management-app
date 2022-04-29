import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizeGuard } from '@auth/guards/authorize.guard';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { EditUserPageComponent } from './pages/edit-user-page/edit-user-page.component';
import { NotFoundComponent } from '@shared/not-found/not-found.component';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'signUp', component: UserRegisterComponent, pathMatch: 'full' },
  {
    path: 'editUser',
    canActivate: [AuthorizeGuard],
    component: EditUserPageComponent,
    pathMatch: 'full',
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
