import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CalendarComponent } from '../calendar.component';
import { Subscription, take } from 'rxjs';

@Directive({
  selector: '[ttDatePicker]',
  standalone: true,
})
export class DatePickerDirective implements OnDestroy {
  @Input('ttDatePicker')
  date = new Date();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('ttDatePickerChange')
  readonly dateChange = new EventEmitter<Date>();

  private readonly overlay = inject(Overlay);
  private readonly element = inject(ElementRef).nativeElement;
  private subscription = Subscription.EMPTY;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('click')
  protected onClick(): void {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    const ref = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.element)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
      panelClass: 'tt-date-picker-panel',
      disposeOnNavigation: true,
      hasBackdrop: true,
    });
    this.subscription.add(ref.backdropClick().subscribe(() => ref.dispose()));

    const portal = new ComponentPortal(CalendarComponent);
    const calendarRef = ref.attach(portal);
    calendarRef.instance.date = this.date;
    const sub = calendarRef.instance.dateChange.pipe(take(1)).subscribe((date) => {
      this.date = date;
      this.dateChange.emit(date);
      ref.dispose();
    });

    this.subscription.add(sub);
    this.subscription.add(() => ref.dispose());
  }
}
