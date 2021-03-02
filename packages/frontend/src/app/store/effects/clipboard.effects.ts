import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { ClipboardActions } from '../actions';

@Injectable()
export class ClipboardEffects {

  copyToClipboard$ = createEffect(() => this.actions$.pipe(
    ofType(ClipboardActions.copyToClipboard),
    tap(({ content }) => {
      const text = content['text/plain'];

      if (text) {
        this.clipboard.copy(text);
      }
    }),
  ), { dispatch: false });

  constructor(
    private readonly actions$: Actions,
    private readonly clipboard: Clipboard,
  ) {
  }

}
