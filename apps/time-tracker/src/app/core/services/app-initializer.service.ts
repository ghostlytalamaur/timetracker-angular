import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { filter, mapTo, take } from 'rxjs/operators';

import { AuthService } from '../auth';

class SplashScreenService {
  constructor(private readonly doc: Document) {}

  setInfo(info: string): void {
    const infoNode = this.getInfoNode();
    if (infoNode) {
      infoNode.innerText = info;
    }
  }

  private getInfoNode(): HTMLElement | null {
    return this.doc.querySelector('.splash-screen > .loading-info');
  }
}

export function appInitializerFactory(): () => Promise<void> {
  const authService = inject(AuthService);
  const splashScreenService = new SplashScreenService(inject(DOCUMENT));

  return async () => {
    splashScreenService.setInfo('Signing in...');

    const isSignedIn = authService
      .isLoading$()
      .pipe(
        filter((isLoading) => !isLoading),
        take(1),
        mapTo(undefined),
      )
      .toPromise();

    return isSignedIn;
  };
}
