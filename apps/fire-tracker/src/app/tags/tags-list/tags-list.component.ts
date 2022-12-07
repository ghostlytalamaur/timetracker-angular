import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { Tag } from '../../models/tag';

@Component({
  selector: 'tt-tags-list',
  templateUrl: './tags-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor],
  host: { class: 'block' },
})
export class TagsListComponent {
  @Input()
  tags = new Array<Tag>();

  protected readonly trackById: TrackByFunction<Tag> = (index, tag) => tag.id;
}
