import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISessionTag } from '@tt/types';
import { Nullable } from '@tt/utils';
import { hasChange } from '@app/core/util';

@Component({
  selector: 'tt-tags-editor',
  templateUrl: './tags-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsEditorComponent implements OnChanges {
  @Input()
  tag: Nullable<ISessionTag>;

  @Output()
  saveTag = new EventEmitter<ISessionTag>();
  @Output()
  addTag = new EventEmitter<string>();

  readonly form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      label: fb.control('', [Validators.required, Validators.min(1)]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (hasChange(this, 'tag', changes)) {
      this.form.setValue({
        label: changes.tag?.currentValue?.label ?? '',
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    let newTag: ISessionTag;
    if (this.tag) {
      newTag = {
        ...this.tag,
        label: this.form.value.label,
      };
      this.saveTag.emit(newTag);
    } else {
      this.addTag.emit(this.form.value.label);
      this.form.reset();
    }
  }
}
