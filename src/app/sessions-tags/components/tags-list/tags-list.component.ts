import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionTag } from '@app/store';


@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit {

  @Input()
  public tags: SessionTag[] = [];
  @Output()
  public deleteTag = new EventEmitter<string>();
  @Input()
  public selectedTag: SessionTag | null = null;
  @Output()
  public readonly selectedTagChange = new EventEmitter<SessionTag | null>();

  public ngOnInit(): void {
  }

  public onDeleteTag(tag: SessionTag): void {
    this.deleteTag.emit(tag.id);
  }

  public trackById(index: number, value: SessionTag): string {
    return value.id;
  }

  public onSelectionChange(id: string): void {
    if (id === this.selectedTag?.id) {
      this.selectedTag = null;
    } else {
      this.selectedTag = this.tags.find(t => t.id === id) ?? null;
    }
    this.selectedTagChange.emit(this.selectedTag);
  }
}
