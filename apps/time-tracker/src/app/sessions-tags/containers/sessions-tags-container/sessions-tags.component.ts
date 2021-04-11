import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IStatus, Nullable } from '@app/shared/utils';
import { SessionsTagsService } from '@app/store';
import { ISessionTag } from '@timetracker/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sessions-tags',
  templateUrl: './sessions-tags.component.html',
  styleUrls: ['./sessions-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsTagsComponent {
  readonly tags$: Observable<Nullable<ISessionTag[]>>;
  readonly status$: Observable<IStatus>;
  selectedTag: ISessionTag | null = null;

  constructor(private readonly tagsService: SessionsTagsService) {
    this.tags$ = this.tagsService.getTags$();
    this.status$ = this.tagsService.getStatus$();
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
