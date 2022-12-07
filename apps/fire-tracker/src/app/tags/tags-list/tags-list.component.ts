import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Tag } from '../../models/tag';
import { IconComponent } from '../../ui/icon.component';

@Component({
  selector: 'tt-tags-list',
  templateUrl: './tags-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, IconComponent],
  host: { class: 'block' },
})
export class TagsListComponent {
  @Input()
  tags = new Array<Tag>();
  @Output()
  readonly deleteTag = new EventEmitter<string>();

  protected readonly trackById: TrackByFunction<Tag> = (index, tag) => tag.id;
}
