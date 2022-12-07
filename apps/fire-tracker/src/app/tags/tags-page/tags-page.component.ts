import { Component, inject, OnInit } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { createSelector, Store } from '@ngrx/store';
import { TopBarLayoutComponent } from '../../layout/top-bar-layout/top-bar-layout.component';
import { selectTags, tagsActions, tagsFeature } from '../../state/tags.store';
import { LoaderDirective } from '../../ui/loader.directive';
import { TagsListComponent } from '../tags-list/tags-list.component';

const selectViewModel = createSelector(tagsFeature.selectStatus, selectTags, (status, tags) => ({
  status,
  tags,
}));

@Component({
  selector: 'tt-tags-page',
  templateUrl: './tags-page.component.html',
  standalone: true,
  imports: [TopBarLayoutComponent, LetModule, LoaderDirective, TagsListComponent],
})
export class TagsPageComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly vm$ = this.store.select(selectViewModel);

  ngOnInit(): void {
    this.store.dispatch(tagsActions.loadTags());
  }

  protected onCreateTag(caption: string): void {
    this.store.dispatch(tagsActions.createTag({ params: { caption, color: '' } }));
  }
}
