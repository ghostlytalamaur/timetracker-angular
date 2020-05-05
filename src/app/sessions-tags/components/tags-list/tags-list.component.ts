import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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

  public ngOnInit(): void {
  }

}
