import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Status, getStatusError, initialStatus, isErrorStatus, isLoadingStatus, isResolvedStatus } from '../../types';
import { hasChange } from '../../utils';

@Component({
  selector: 'app-status-container',
  templateUrl: './status-container.component.html',
  styleUrls: ['./status-container.component.scss'],
})
export class StatusContainerComponent implements OnChanges {

  @Input()
  status: Status = initialStatus();

  showContent = false;
  showLoadingIndicator = false;
  showError = false;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChange(this, 'status', changes)) {
      this.showContent = isResolvedStatus(this.status);
      this.showLoadingIndicator = isLoadingStatus(this.status);
      this.showError = isErrorStatus(this.status);
      this.error = getStatusError(this.status);
    }
  }

}
