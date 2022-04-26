import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HomePageComponent],
  imports: [CommonModule, CoreRoutingModule],
  exports: [FooterComponent, HomePageComponent, HeaderComponent],
})
export class CoreModule {}
