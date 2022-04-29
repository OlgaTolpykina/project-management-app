import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslocoRootModule } from '@shared/transloco/transloco-root.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateBoardComponent } from './components/modals/create-board/create-board.component';

@NgModule({
  declarations: [CreateBoardComponent],
  imports: [CommonModule, MaterialModule, TranslocoRootModule, FlexLayoutModule],
  exports: [MaterialModule, TranslocoRootModule, FlexLayoutModule],
})
export class SharedModule {}
