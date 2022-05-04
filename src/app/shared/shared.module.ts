import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { TranslocoRootModule } from '@shared/transloco/transloco-root.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateBoardComponent } from '../board/components/create-board/create-board.component';
import { UserMessageComponent } from './user-message/user-message.component';

@NgModule({
  declarations: [CreateBoardComponent, UserMessageComponent],
  imports: [CommonModule, MaterialModule, TranslocoRootModule, FlexLayoutModule],
  exports: [MaterialModule, TranslocoRootModule, FlexLayoutModule, UserMessageComponent],
})
export class SharedModule {}
