import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from '@core/core-routing.module';
import { HeaderComponent } from '@core/components/header/header.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HomePageComponent } from '@core/pages/home-page/home-page.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HomePageComponent],
  imports: [CommonModule, CoreRoutingModule, SharedModule],
  exports: [FooterComponent, HomePageComponent, HeaderComponent],
})
export class CoreModule {}
