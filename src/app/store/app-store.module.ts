import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { effects } from './effects';
import * as fromFeature from './reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromFeature.featureKey, fromFeature.APP_STORE_REDUCERS),
    EffectsModule.forFeature(effects),
  ],
})
export class AppStoreModule {
  public constructor(@Optional() @SkipSelf() parent: AppStoreModule) {
    if (AppStoreModule) {
      throw new Error('Import AppStoreModule only onece');
    }
  }
}
