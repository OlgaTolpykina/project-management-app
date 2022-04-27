import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { AuthComponent } from './components/auth/auth.component';
import { NotFoundComponent } from '@shared/not-found/not-found.component';

const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: UserRegisterComponent, pathMatch: 'full' },
    ],
  },
  // { path: 'login', component: LoginPageComponent },
  // { path: 'register', component: UserRegisterComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
