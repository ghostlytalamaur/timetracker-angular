import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SessionTag, SessionsTagsService } from '@app/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-sessions-tags',
  templateUrl: './sessions-tags.component.html',
  styleUrls: ['./sessions-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsTagsComponent implements OnInit {

  public readonly tags$: Observable<SessionTag[]>;
  public selectedTag: SessionTag | null = null;

  public constructor(
    private readonly tagsService: SessionsTagsService,
  ) {
    this.tags$ = this.tagsService.getTags();
  }

  public ngOnInit(): void {
    this.tagsService.loadTags();
  }

  public onDeleteTag(tagId: string): void {
    if (this.selectedTag?.id === tagId) {
      this.selectedTag = null;
    }

    this.tagsService.deleteTag(tagId);
  }

  public onSaveTag(tag: SessionTag): void {
    this.tagsService.saveTag(tag);
  }

  public onTagSelected(tag: SessionTag | null): void {
    this.selectedTag = tag;
  }
}
