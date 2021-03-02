import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { effects } from './effects';
import * as fromFeature from './reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromFeature.featureKey, fromFeature.reducer),
    EffectsModule.forFeature([...effects]),
  ],
})
export class AppStoreModule {
  constructor(@Optional() @SkipSelf() parent: AppStoreModule) {
    if (parent) {
      throw new Error('Import AppStoreModule only once');
    }
  }
}
