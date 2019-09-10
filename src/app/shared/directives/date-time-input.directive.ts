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
  SimpleChanges
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NgControl, ValidationErrors } from '@angular/forms';
import { format, parse } from 'date-fns';
import { MatFormFieldControl } from '@angular/material';
import { Observable, Subject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { FocusMonitor } from '@angular/cdk/a11y';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

function isValidDate(date: Date | null | undefined): date is Date {
  return date instanceof Date && isFinite(+date);
}

function dateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value || isValidDate(control.value)) {
    return null;
  }
  return { invalidDate: true };
}

@Directive({
  selector: 'input[appDateTimeInput]',
  providers: [
    { provide: MatFormFieldControl, useExisting: DateTimeInputDirective },
    { provide: NG_VALIDATORS, useValue: dateValidator, multi: true }
  ]
})
export class DateTimeInputDirective implements OnInit, OnDestroy, OnChanges, ControlValueAccessor, MatFormFieldControl<Date> {

  /** Gets the NgControl for this control. */
  readonly ngControl: NgControl | null;
  @HostBinding('attr.disabled')
  isDisabled: boolean;
  @HostBinding('attr.aria-describedby')
  describedBy = '';
  @HostBinding('class')
  readonly class = 'mat-input-element mat-form-field-autofill-control';
  @Input('appDateTimeInput')
  format: string;
  @Output()
  readonly valueChange: EventEmitter<Date | null>;
  /**
   * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void>;
  /**
   * An optional name for the control type that can be used to distinguish `mat-form-field` elements
   * based on their control type. The form field will add a class,
   * `mat-form-field-type-{{controlType}}` to its root element.
   */
  readonly controlType = 'date-time-input';
  private readonly stateChangesSubj: Subject<void>;
  private subscription: Subscription;
  private date: Date | null;
  private mId: string;
  private readonly uid: string;
  @HostBinding('attr.placeholder')
  private mPlaceholder: string;
  private mFocused = false;
  @HostBinding('attr.required')
  private mRequired = false;
  @HostBinding('disabled')
  private mDisabled = false;
  private mAutoFilled = false;
  private onTouched: () => void;
  private onChange: (value: Date | null) => void;

  constructor(
    private readonly focusMonitor: FocusMonitor,
    private readonly autoFillMonitor: AutofillMonitor,
    private readonly input: ElementRef<HTMLInputElement>,
    @Optional() @Self() ngControl: NgControl
  ) {
    this.ngControl = ngControl ? ngControl : null;
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.onChange = (ignored: Date | null) => {
    };
    this.onTouched = () => {
    };
    this.stateChangesSubj = new Subject();
    this.stateChanges = this.stateChangesSubj.asObservable();
    this.valueChange = new EventEmitter<any>();
    this.uid = uuid();
  }

  /** The element ID for this control. */
  @Input()
  get id(): string {
    return this.mId ? this.mId : this.uid;
  }

  set id(value: string) {
    this.mId = value;
  }

  /** The value of the control. */
  @Input()
  get value(): Date | null {
    return this.date;
  }

  set value(date: Date | null) {
    this.writeValue(date);
  }

  /** The placeholder for this control. */
  @Input()
  get placeholder(): string {
    return this.mPlaceholder;
  }

  set placeholder(value: string) {
    this.mPlaceholder = value;
    this.stateChangesSubj.next();
  }

  /** Whether the control is focused. */
  get focused(): boolean {
    return this.mFocused;
  }

  /** Whether the control is empty. */
  get empty(): boolean {
    return !this.input.nativeElement.value;
  }

  /** Whether the `MatFormField` label should try to float. */
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  /** Whether the control is required. */
  @Input()
  get required(): boolean {
    return this.mRequired;
  }

  set required(value: boolean) {
    this.mRequired = coerceBooleanProperty(value);
    this.stateChangesSubj.next();
  }

  /** Whether the control is disabled. */
  @Input()
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

  /** Whether the control is in an error state. */
  get errorState(): boolean {
    return !!this.ngControl && !!this.ngControl.errors;
  }

  /**
   * Whether the input is currently in an autofilled state. If property is not present on the
   * control it is assumed to be false.
   */
  get autofilled(): boolean {
    return this.mAutoFilled;
  }

  /** Sets the list of element IDs that currently describe this control. */
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  /** Handles a click on the control's container. */
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
      })
    );

    this.subscription.add(
      this.subscription = this.focusMonitor.monitor(this.input, true)
        .subscribe(origin => {
          this.mFocused = !!origin;
          this.onTouched();
          this.stateChangesSubj.next();
        })
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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: any): void {
    if (!value) {
      return;
    }
    if (!(value instanceof Date)) {
      throw new Error('Unsupported value');
    }

    this.date = value;
    this.input.nativeElement.value = isValidDate(this.value) ? format(this.value, this.format) : '';
    this.valueChange.emit(this.date);
    this.stateChangesSubj.next();
  }

  @HostListener('change')
  @HostListener('input')
  onInputChange() {
    const value = this.input.nativeElement.value;
    this.date = value ? parse(value, this.format, isValidDate(this.value) ? this.value : new Date()) : null;
    this.onChange(this.value);
    this.valueChange.emit(this.date);
    this.stateChangesSubj.next();
  }

}
