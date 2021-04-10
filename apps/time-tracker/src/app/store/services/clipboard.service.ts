import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {

  constructor(
    private readonly clipboard: Clipboard,
  ) {
  }

  copyToClipboard(content: Record<string, string>): void {
    const text = content['text/plain'];

    if (text) {
      this.clipboard.copy(text);
    }
  }

}
