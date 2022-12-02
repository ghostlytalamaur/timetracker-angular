import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { DialogsService } from './dialogs.service';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@NgModule({
  imports: [CommonModule, MatDialogModule],
  declarations: [AlertDialogComponent],
  providers: [DialogsService],
})
export class UiDialogsModule {}
