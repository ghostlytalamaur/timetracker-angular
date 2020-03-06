import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlertDialogComponent, AlertDialogData, ConfirmationDialogData, DialogResult } from './alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {

  readonly defaultConfig: MatDialogConfig = {
    minWidth: 300,
    role: 'alertdialog',
    panelClass: 'custom-mat-dialog',
  };

  constructor(
    private readonly matDialog: MatDialog,
  ) {
  }

  confirmation(data: Omit<ConfirmationDialogData, 'type'>): Observable<void> {
    return this.matDialog.open<AlertDialogComponent, ConfirmationDialogData>(AlertDialogComponent,
      {
        ...this.defaultConfig,
        data: {
          type: 'confirmation',
          ...data,
        },
      })
      .afterClosed()
      .pipe(
        map((result: DialogResult) => {
          if (result !== 'ok') {
            throw new Error('Dialog closed with negative result');
          }
        }),
      );
  }

  showAlert(data: Omit<AlertDialogData, 'type'>): Observable<void> {
    return this.matDialog.open<AlertDialogComponent, AlertDialogData>(AlertDialogComponent,
      {
        ...this.defaultConfig,
        data: {
          type: 'alert',
          ...data,
        },
      })
      .afterClosed();
  }

  component<D, R>(component: ComponentType<any>, data?: D): Observable<R | undefined> {
    return this.matDialog.open<any, D, R>(component,
      {
        ...this.defaultConfig,
        data,
      })
      .afterClosed();
  }
}
