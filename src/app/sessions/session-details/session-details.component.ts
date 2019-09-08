import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../sessions.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Session } from '../model/session';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit {

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;
  readonly session$: Observable<Session | undefined>;

  constructor(
    private route: ActivatedRoute,
    private sessionsSrv: SessionsService
  ) {
    this.session$ = this.route.params
      .pipe(
        switchMap(params => {
          const id = params.id;
          if (id) {
            return this.sessionsSrv.getSession(id);
          } else {
            return of(undefined);
          }
        })
      );
  }

  ngOnInit() {
  }

}
