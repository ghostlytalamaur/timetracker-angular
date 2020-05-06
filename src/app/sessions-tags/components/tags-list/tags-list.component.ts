import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SessionTag } from '../../models';

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
  @Output()
  public tagSelected = new EventEmitter<SessionTag | null>();

  public ngOnInit(): void {
  }

  public onDeleteTag(tag: SessionTag): void {
    this.deleteTag.emit(tag.id);
  }

  public trackById(index: number, value: SessionTag): string {
    return value.id;
  }

  public onSelectionChange(id: string): void {
    this.tagSelected.emit(this.tags.find(t => t.id === id) ?? null);
  }
}
