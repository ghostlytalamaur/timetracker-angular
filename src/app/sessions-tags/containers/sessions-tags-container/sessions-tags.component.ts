import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionTag } from '../../models';
import { SessionsTagsService } from '../../services';

@Component({
  selector: 'app-sessions-tags',
  templateUrl: './sessions-tags.component.html',
  styleUrls: ['./sessions-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsTagsComponent implements OnInit {

  public tags$: Observable<SessionTag[]>;

  public constructor(
    private readonly tagsService: SessionsTagsService,
  ) {
    this.tags$ = this.tagsService.getTags();
  }

  public ngOnInit(): void {
  }

}
