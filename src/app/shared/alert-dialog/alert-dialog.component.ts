import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AlertDialogData {
  type: 'alert';
  title?: string;
  message: string;
}

export interface ConfirmationDialogData {
  type: 'confirmation';
  title?: string;
  message: string;
}

type DialogData = AlertDialogData | ConfirmationDialogData;
export type DialogResult = 'ok' | 'cancel' | 'close';

@Component({
  templateUrl: './alert-dialog.component.html',
})
export class AlertDialogComponent implements OnInit {

  public readonly confirmationType = 'confirmation';
  public readonly alertType = 'alert';

  public readonly okResult: DialogResult = 'ok';
  public readonly cancelResult: DialogResult = 'cancel';
  public readonly closeResult: DialogResult = 'close';

  public constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: DialogData,
  ) {
  }

  public ngOnInit() {
  }

}
