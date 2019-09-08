import { MatDialog } from '@angular/material';
import { AlertDialogComponent, AlertDialogData } from './alert-dialog.component';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {
  constructor(
    private readonly matDialog: MatDialog
  ) {
  }

  showAlert(data: AlertDialogData): Observable<void> {
    return this.matDialog.open<AlertDialogComponent, AlertDialogData>(AlertDialogComponent,
      {
        minWidth: 300,
        role: 'alertdialog',
        data
      })
      .afterClosed();
  }
}
