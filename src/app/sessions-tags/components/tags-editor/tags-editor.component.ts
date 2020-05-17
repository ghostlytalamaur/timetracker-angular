import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { hasChange } from '@app/shared/utils';
import { SessionTag, createSessionTag } from '@app/store';

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

    let newTag: SessionTag;
    if (this.tag) {
      newTag = {
        ...this.tag,
        label: this.form.value.label,
      };
    } else {
      newTag = createSessionTag(this.form.value.label);
      this.form.reset();
    }

    this.saveTag.emit(newTag);
  }
}
