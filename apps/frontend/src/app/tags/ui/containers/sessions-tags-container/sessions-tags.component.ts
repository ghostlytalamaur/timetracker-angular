import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ISessionTag } from '@tt/types';
import { Observable } from 'rxjs';
import { IStatus } from '@app/core/store';
import { SessionsTagsService } from '@app/tags/core';
import { Nullable } from '@tt/utils';

@Component({
  selector: 'tt-sessions-tags',
  templateUrl: './sessions-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsTagsComponent implements OnInit, OnDestroy {
  readonly tags$: Observable<Nullable<ISessionTag[]>>;
  readonly status$: Observable<IStatus>;
  selectedTag: ISessionTag | null = null;

  constructor(private readonly tagsService: SessionsTagsService) {
    this.tags$ = this.tagsService.getTags$();
    this.status$ = this.tagsService.getStatus$();
  }

  ngOnInit(): void {
    this.tagsService.request();
  }

  ngOnDestroy(): void {
    this.tagsService.cancelRequest();
  }

  onDeleteTag(tagId: string): void {
    if (this.selectedTag?.id === tagId) {
      this.selectedTag = null;
    }

    this.tagsService.deleteTag(tagId);
  }

  onAddTag(label: string): void {
    this.tagsService.addTag(label);
  }

  onSaveTag(tag: ISessionTag): void {
    this.tagsService.saveTag(tag);
  }
}
