import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

export interface AlertDialogData {
  type: 'alert';
  title?: string;
  message: string;
}

export interface ConfirmationDialogData {
  type: 'confirmation';
  title?: string;
  message: string;
  positiveText?: string;
}

type DialogData = AlertDialogData | ConfirmationDialogData;
export type DialogResult = 'ok' | 'cancel' | 'close';

@Component({
  templateUrl: './alert-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogComponent {
  readonly confirmationType = 'confirmation';
  readonly alertType = 'alert';

  readonly okResult: DialogResult = 'ok';
  readonly cancelResult: DialogResult = 'cancel';
  readonly closeResult: DialogResult = 'close';

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: DialogData) {}
}
