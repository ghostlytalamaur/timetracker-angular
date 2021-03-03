import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Status } from '@app/shared/types';
import { SessionTag, SessionsTagsService } from '@app/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sessions-tags',
  templateUrl: './sessions-tags.component.html',
  styleUrls: ['./sessions-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsTagsComponent {

  readonly tags$: Observable<SessionTag[]>;
  readonly status$: Observable<Status>;
  selectedTag: SessionTag | null = null;

  constructor(
    private readonly tagsService: SessionsTagsService,
  ) {
    this.tags$ = this.tagsService.getTags();
    this.status$ = this.tagsService.getStatus();
  }

  onDeleteTag(tagId: string): void {
    if (this.selectedTag?.id === tagId) {
      this.selectedTag = null;
    }

    this.tagsService.deleteTag(tagId);
  }

  onSaveTag(tag: SessionTag): void {
    this.tagsService.saveTag(tag);
  }

}
