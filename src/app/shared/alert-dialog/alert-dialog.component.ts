import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface AlertDialogData {
  title: string;
  message: string;
}

@Component({
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent implements OnInit {

  constructor(
    private readonly dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: AlertDialogData
  ) {
  }

  ngOnInit() {
  }

}
