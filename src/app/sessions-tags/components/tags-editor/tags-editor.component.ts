import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SessionTag, createSessionTag } from '../../models';

interface TypedSimpleChange<T> extends SimpleChange {
  previousValue: T;
  currentValue: T;
}

function hasChange<T, K extends keyof T>(directive: T, key: K, changes: SimpleChanges):
  changes is SimpleChanges & { [p in K]: TypedSimpleChange<T[K]> } {
  return key in changes;
}

@Component({
  selector: 'app-tags-editor',
  templateUrl: './tags-editor.component.html',
  styleUrls: ['./tags-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsEditorComponent implements OnInit, OnChanges {

  @Input()
  public tag: SessionTag | null = null;

  @Output()
  public saveTag = new EventEmitter<SessionTag>();

  public readonly form: FormGroup;

  public constructor(fb: FormBuilder) {
    this.form = fb.group({
      label: fb.control('', [Validators.required, Validators.min(1)]),
    });
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (hasChange(this, 'tag', changes)) {
      this.form.setValue({
        label: changes.tag.currentValue?.label ?? '',
      });
    }
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.saveTag.emit(createSessionTag(this.form.value.label));
  }
}
