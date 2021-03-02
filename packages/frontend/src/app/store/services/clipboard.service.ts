import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClipboardActions } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  constructor(
    private readonly store: Store,
  ) {
  }

  copyToClipboard(content: Record<string, string>): void {
    this.store.dispatch(ClipboardActions.copyToClipboard({ content }));
  }

}
