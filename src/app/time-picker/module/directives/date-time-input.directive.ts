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
  public describedBy = '';

  @HostBinding('class')
  public readonly class = 'mat-input-element mat-form-field-autofill-control';

  public readonly ngControl: NgControl | null;
  public readonly stateChanges: Observable<void>;
  public readonly controlType = 'date-time-input';

  private readonly stateChangesSubj: Subject<void>;
  @Output()
  public readonly valueChange: EventEmitter<Date | null> = new EventEmitter<any>();
  private readonly uid = uuid();
  private mRequired = false;
  private mDisabled = false;
  private subscription: Subscription;
  private date: Date | null;
  private mId: string;
  private mPlaceholder: string;
  private mFocused = false;
  private mAutoFilled = false;
  private mFormat: string;

  public constructor(
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

  public get format(): string {
    return this.mFormat;
  }

  @Input('appDateTimeInput')
  public set format(fmt: string) {
    this.mFormat = fmt;
    this.input.nativeElement.value = isValidDate(this.value) && this.format ? DateTime.fromJSDate(this.value).toFormat(this.format) : '';
    this.stateChangesSubj.next();
  }

  @Input()
  public get value(): Date | null {
    return this.date;
  }

  public set value(date: Date | null) {
    this.writeValue(date);
  }

  @Input()
  @HostBinding('attr.id')
  public get id(): string {
    return this.mId ? this.mId : this.uid;
  }

  public set id(value: string) {
    this.mId = value;
  }

  @Input()
  @HostBinding('attr.placeholder')
  public get placeholder(): string {
    return this.mPlaceholder;
  }

  public set placeholder(value: string) {
    this.mPlaceholder = value;
    this.stateChangesSubj.next();
  }


  @Input()
  @HostBinding('required')
  public get required(): boolean {
    return this.mRequired;
  }

  public set required(value: boolean) {
    this.mRequired = coerceBooleanProperty(value);
    this.stateChangesSubj.next();
  }

  @Input()
  @HostBinding('disabled')
  public get disabled(): boolean {
    return this.mDisabled;
  }

  public set disabled(value: boolean) {
    this.mDisabled = coerceBooleanProperty(value);
    if (this.focused) {
      this.mFocused = false;
      this.stateChangesSubj.next();
    }
  }

  public get focused(): boolean {
    return this.mFocused;
  }

  public get empty(): boolean {
    return !this.input.nativeElement.value;
  }

  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(value: any): void {
    if (!value || value === this.date) {
      return;
    }
    this.date = isValidDate(value) ? value : null;

    this.input.nativeElement.value = isValidDate(this.value) && this.format ? DateTime.fromJSDate(this.value).toFormat(this.format) : '';
    this.valueChange.emit(this.date);
    this.stateChangesSubj.next();
  }

  public get errorState(): boolean {
    return !!this.ngControl && !!this.ngControl.errors;
  }

  public get autofilled(): boolean {
    return this.mAutoFilled;
  }

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.input.nativeElement.focus();
    }
  }

  public ngOnInit() {
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

  public ngOnDestroy(): void {
    this.autoFillMonitor.stopMonitoring(this.input);
    this.focusMonitor.stopMonitoring(this.input);
    this.subscription.unsubscribe();
    this.stateChangesSubj.complete();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.stateChangesSubj.next();
  }

  public registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('change')
  @HostListener('input')
  public onInputChange() {
    const value = this.input.nativeElement.value;
    this.date = value ? DateTime.fromFormat(value, this.format).toJSDate() : null;

    if (!isValidDate(this.date)) {
      this.date = null;
    }

    this.onChange(this.value);
    this.valueChange.emit(this.date);
    this.stateChangesSubj.next();
  }

  private onTouched: () => void = () => {
  };
  private onChange: (value: Date | null) => void = (ignored: Date | null) => {
  };

}
