import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { preferencesActions, preferencesFeature } from '../../preferences/preferences.store';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'tt-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LetModule],
})
export class ThemeSwitcherComponent {
  private readonly store = inject(Store);
  protected readonly darkMode$ = this.store.select(preferencesFeature.selectDarkMode);

  protected onChangeDarkMode(): void {
    this.store.dispatch(preferencesActions.toggleDarkMode());
  }
}
