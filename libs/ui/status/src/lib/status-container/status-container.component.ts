import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  getStatusError,
  initialStatus,
  isErrorStatus,
  isLoadingStatus,
  isResolvedStatus,
  IStatus,
} from '@tt/core/store';
import { hasChange, Nullable } from '@tt/core/util';

@Directive({
  selector: '[ttResolved]',
})
export class ResolvedTemplateDirective {
  constructor(public readonly template: TemplateRef<void>) {}
}

@Component({
  selector: 'tt-status-container',
  templateUrl: './status-container.component.html',
  styleUrls: ['./status-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusContainerComponent implements OnChanges {
  @Input()
  status: Nullable<IStatus>;

  @ContentChild(ResolvedTemplateDirective)
  resolvedContent: ResolvedTemplateDirective | null = null;

  showContent = false;
  showLoadingIndicator = false;
  showError = false;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChange(this, 'status', changes)) {
      this.status = this.status ?? initialStatus();
      this.showLoadingIndicator = isLoadingStatus(this.status);
      this.showError = isErrorStatus(this.status);
      this.error = getStatusError(this.status);
      this.showContent = isResolvedStatus(this.status) && !this.error;
    }
  }
}
