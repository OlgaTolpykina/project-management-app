import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from '@core/core-routing.module';
import { HeaderComponent } from '@core/components/header/header.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HomePageComponent } from '@core/pages/home-page/home-page.component';
import { SharedModule } from '@shared/shared.module';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    SidenavListComponent,
    CarouselComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, CoreRoutingModule, SharedModule],
  exports: [FooterComponent, HomePageComponent, HeaderComponent, SidenavListComponent],
})
export class CoreModule {}
