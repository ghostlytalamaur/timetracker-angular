import { Directionality } from '@angular/cdk/bidi';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { DateTime } from 'luxon';
import { merge } from 'rxjs';
import { filter, take, finalize } from 'rxjs/operators';

import { TimePickerContentComponent } from './time-picker-content.component';


function isEscape(event: KeyboardEvent): boolean {
  return event.keyCode === ESCAPE || event.keyCode === ENTER;
}

@Component({
  selector: 'app-time-picker',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent implements OnDestroy {
  private overlayRef: OverlayRef | null = null;
  private componentRef: ComponentRef<TimePickerContentComponent> | null = null;
  private opened = false;
  private previouslyActiveElement: Element | null;

  @Input() public dateTime: DateTime = DateTime.local();
  @Output() public dateTimeChange = new EventEmitter<DateTime>();

  public constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly dir: Directionality,
    private readonly viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private readonly doc: Document,
    @Optional() private readonly matFormField: MatFormField,
  ) {
  }

  public ngOnDestroy(): void {
    this.destroyPopup();
    this.close();
  }

  public open(): void {
    if (this.opened) {
      console.log('open: already opened');
      return;
    }
    this.previouslyActiveElement = this.doc.activeElement;
    this.destroyPopup();

    const overlayRef = this.getPopup();
    this.componentRef = overlayRef.attach(this.createPortal());
    this.componentRef.instance.timePicker = this;

    this.opened = true;
    console.log('open: opened');
  }

  public close(): void {
    if (!this.opened) {
      return;
    }

    if (this.componentRef && this.overlayRef) {
      const instance = this.componentRef.instance;
      instance.startExitAnimation();
      instance.animationDone
        .pipe(
          take(1),
        )
        .subscribe(() => this.destroyPopup());
    }

    const completeClosing = () => {
      if (this.opened) {
        this.opened = false;
        this.previouslyActiveElement = null;
      }
    };

    if (this.previouslyActiveElement instanceof HTMLElement) {
      console.log('focusing element');
      this.previouslyActiveElement.focus();
      setTimeout(completeClosing);
    } else {
      completeClosing();
    }
  }

  private destroyPopup(): void {
    if (this.overlayRef) {
      console.log('dispose portal');
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.componentRef = null;
    }
  }

  private getPopup(): OverlayRef {
    if (!this.overlayRef) {
      const overlayConfig = new OverlayConfig({
        positionStrategy: this.createPopupPositionStrategy(),
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        direction: this.dir,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        panelClass: 'time-picker-popup',
      });

      this.overlayRef = this.overlay.create(overlayConfig);

      merge(
        this.overlayRef.detachments(),
        this.overlayRef.backdropClick(),
        this.overlayRef.keydownEvents()
          .pipe(
            filter(isEscape),
          ),
      )
        .subscribe(event => {
          if (event) {
            event.preventDefault();
          }

          this.close();
        });
    }

    return this.overlayRef;
  }

  private createPopupPositionStrategy(): PositionStrategy {
    return this.overlay.position()
      .flexibleConnectedTo(this.matFormField ? this.matFormField.getConnectedOverlayOrigin() : this.element)
      .withTransformOriginOn('.time-picker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
  }

  private createPortal(): ComponentPortal<TimePickerContentComponent> {
    return new ComponentPortal(TimePickerContentComponent, this.viewContainerRef);
  }

}
