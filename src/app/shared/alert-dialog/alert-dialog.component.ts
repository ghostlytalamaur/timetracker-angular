import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface AlertDialogData {
  title: string;
  message: string;
}

@Component({
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: AlertDialogData
  ) {
  }

  ngOnInit() {
  }

}
