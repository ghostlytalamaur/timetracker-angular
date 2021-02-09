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
  tags: SessionTag[] = [];
  @Output()
  deleteTag = new EventEmitter<string>();
  @Input()
  selectedTag: SessionTag | null = null;
  @Output()
  readonly selectedTagChange = new EventEmitter<SessionTag | null>();

  ngOnInit(): void {
  }

  onDeleteTag(tag: SessionTag): void {
    this.deleteTag.emit(tag.id);
  }

  trackById(index: number, value: SessionTag): string {
    return value.id;
  }

  onSelectionChange(id: string): void {
    if (id === this.selectedTag?.id) {
      this.selectedTag = null;
    } else {
      this.selectedTag = this.tags.find(t => t.id === id) ?? null;
    }
    this.selectedTagChange.emit(this.selectedTag);
  }
}
