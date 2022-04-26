import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatInputModule, MatSlideToggleModule, MatButtonToggleModule],
  exports: [MatInputModule, MatSlideToggleModule, MatButtonToggleModule],
})
export class MaterialModule {}
