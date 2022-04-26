import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslocoRootModule } from '@shared/transloco/transloco-root.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule, TranslocoRootModule],
  exports: [MaterialModule, TranslocoRootModule],
})
export class SharedModule {}
