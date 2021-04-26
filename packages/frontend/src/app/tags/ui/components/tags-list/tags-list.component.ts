import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Nullable } from '@tt/core/util';
import { ISessionTag } from '@tt/types';

@Component({
  selector: 'tt-tags-list',
  templateUrl: './tags-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent {
  @Input()
  tags: Nullable<ISessionTag[]>;
  @Input()
  selectedTag: Nullable<ISessionTag>;

  @Output()
  readonly deleteTag = new EventEmitter<string>();
  @Output()
  readonly selectedTagChange = new EventEmitter<ISessionTag | null>();

  onDeleteTag(tag: ISessionTag): void {
    this.deleteTag.emit(tag.id);
  }

  trackById(index: number, value: ISessionTag): string {
    return value.id;
  }

  onSelectionChange(id: string): void {
    if (id === this.selectedTag?.id) {
      this.selectedTag = null;
    } else {
      this.selectedTag = this.tags?.find((t) => t.id === id) ?? null;
    }
    this.selectedTagChange.emit(this.selectedTag);
  }
}
