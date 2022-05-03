import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslocoRootModule } from '@shared/transloco/transloco-root.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateBoardComponent } from '../board/components/create-board/create-board.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateBoardComponent],
  imports: [CommonModule, MaterialModule, TranslocoRootModule, FlexLayoutModule, FormsModule],
  exports: [MaterialModule, TranslocoRootModule, FlexLayoutModule, FormsModule],
})
export class SharedModule {}
