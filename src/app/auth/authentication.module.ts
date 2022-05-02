import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { EditUserPageComponent } from './pages/edit-user-page/edit-user-page.component';
import { MessagePageComponent } from './components/message-page/message-page.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    UserRegisterComponent,
    EditUserPageComponent,
    MessagePageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AuthenticationRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthenticationModule {}
