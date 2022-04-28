import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '@shared/shared.module';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [LoginPageComponent, UserRegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatIconModule,
    AuthenticationRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthenticationModule {}
