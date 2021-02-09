import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NgControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { DateTime } from 'luxon';
import { Observable, Subject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

function isValidDate(date: Date | null | undefined): date is Date {
  return !!(date && isFinite(+date));
}

export function dateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value || isValidDate(control.value)) {
    return null;
  }
  return { invalidDate: true };
}

@Directive({
  selector: 'input[appDateTimeInput]',
  providers: [
    { provide: MatFormFieldControl, useExisting: DateTimeInputDirective },
    { provide: NG_VALIDATORS, useValue: dateValidator, multi: true },
  ],
})
export class DateTimeInputDirective implements OnInit, OnDestroy, OnChanges, ControlValueAccessor, MatFormFieldControl<Date> {

  @HostBinding('attr.aria-describedby')
  describedBy = '';

  @HostBinding('class')
  readonly class = 'mat-input-element mat-form-field-autofill-control';

  @Output()
  readonly valueChange: EventEmitter<Date | null> = new EventEmitter<any>();

  readonly ngControl: NgControl | null;
  readonly stateChanges: Observable<void>;
  readonly controlType = 'date-time-input';

  private readonly stateChangesSubj: Subject<void>;
  private readonly uid = uuid();
  private mRequired = false;
  private mDisabled = false;
  private subscription!: Subscription;
  private date!: Date | null;
  private mId!: string;
  private mPlaceholder!: string;
  private mFocused = false;
  private mAutoFilled = false;

  constructor(
    private readonly focusMonitor: FocusMonitor,
    private readonly autoFillMonitor: AutofillMonitor,
    private readonly input: ElementRef<HTMLInputElement>,
    @Optional() @Self() ngControl: NgControl,
  ) {
    this.ngControl = ngControl ? ngControl : null;
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.stateChangesSubj = new Subject();
    this.stateChanges = this.stateChangesSubj.asObservable();
  }

  @Input()
  get value(): Date | null {
    return this.date;
  }

  set value(date: Date | null) {
    this.writeValue(date);
  }

  @Input()
  @HostBinding('attr.id')
  get id(): string {
    return this.mId ? this.mId : this.uid;
  }

  set id(value: string) {
    this.mId = value;
  }

  @Input()
  @HostBinding('attr.placeholder')
  get placeholder(): string {
    return this.mPlaceholder;
  }

  set placeholder(value: string) {
    this.mPlaceholder = value;
    this.stateChangesSubj.next();
  }


  @Input()
  @HostBinding('required')
  get required(): boolean {
    return this.mRequired;
  }

  set required(value: boolean) {
    this.mRequired = coerceBooleanProperty(value);
    this.stateChangesSubj.next();
  }

  @Input()
  @HostBinding('disabled')
  get disabled(): boolean {
    return this.mDisabled;
  }

  set disabled(value: boolean) {
    this.mDisabled = coerceBooleanProperty(value);
    if (this.focused) {
      this.mFocused = false;
      this.stateChangesSubj.next();
    }
  }

  get focused(): boolean {
    return this.mFocused;
  }

  get empty(): boolean {
    return !this.input.nativeElement.value;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @HostListener('change')
  @HostListener('input')
  onInputChange() {
    const value = this.input.nativeElement.value;
    this.date = value ? DateTime.fromISO(value).toJSDate() : null;

    if (!isValidDate(this.date)) {
      this.date = null;
    }

    this.onChange(this.value);
    this.valueChange.emit(this.date);
    this.stateChangesSubj.next();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    if (!value || value === this.date) {
      return;
    }
    this.date = isValidDate(value) ? value : null;

    this.input.nativeElement.value = isValidDate(this.value)
        ? DateTime.fromJSDate(this.value).set({ millisecond: 0 }).toISOTime({
          includeOffset: false,
          suppressSeconds: false,
          suppressMilliseconds: true,
        })
        : '';
    this.valueChange.emit(this.date);
    this.stateChangesSubj.next();
  }

  get errorState(): boolean {
    return !!this.ngControl && !!this.ngControl.errors;
  }

  get autofilled(): boolean {
    return this.mAutoFilled;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.input.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.subscription.add(
      this.autoFillMonitor.monitor(this.input).subscribe(event => {
        this.mAutoFilled = event.isAutofilled;
        this.stateChangesSubj.next();
      }),
    );

    this.subscription.add(
      this.subscription = this.focusMonitor.monitor(this.input, true)
        .subscribe(origin => {
          this.mFocused = !!origin;
          this.onTouched();
          this.stateChangesSubj.next();
        }),
    );
  }

  ngOnDestroy(): void {
    this.autoFillMonitor.stopMonitoring(this.input);
    this.focusMonitor.stopMonitoring(this.input);
    this.subscription.unsubscribe();
    this.stateChangesSubj.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stateChangesSubj.next();
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onTouched: () => void = () => {
  };
  private onChange: (value: Date | null) => void = (ignored: Date | null) => {
  };

}
