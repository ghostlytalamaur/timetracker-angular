import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { mapTo, skip, take } from 'rxjs/operators';

import { AuthService } from '../auth';

class SplashScreenService {
  public constructor(
    private readonly doc: Document,
  ) {
  }

  public setInfo(info: string): void {
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

  return () => {
    splashScreenService.setInfo('Signing in...');

    const isSignedIn = authService.isSignedIn()
      .pipe(
        skip(1),
        take(1),
        mapTo(void 0),
      )
      .toPromise();
    authService.autoSignIn();

    return isSignedIn;
  }
}
