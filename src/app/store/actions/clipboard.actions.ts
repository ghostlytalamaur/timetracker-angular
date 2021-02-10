import { createAction, props } from '@ngrx/store';
import { ClipboardContent } from '../models';

export const copyToClipboard = createAction(
  '[Clipboard] Copy to Clipboard',
  props<{
    content: ClipboardContent;
  }>(),
);
