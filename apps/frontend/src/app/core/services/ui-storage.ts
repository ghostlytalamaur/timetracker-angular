import { Observable, of } from 'rxjs';
import { isDefined, Nullable } from '@tt/utils';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStorageService {
  get$<T>(key: string): Observable<Nullable<T>> {
    const value = localStorage.getItem(key);
    if (isDefined(value)) {
      try {
        return of(JSON.parse(value));
      } catch (e) {}
    }

    return of(null);
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
