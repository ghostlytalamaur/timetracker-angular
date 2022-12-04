import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Story } from '@storybook/angular';
import { DatePickerDirective } from './date-picker.directive';

@Component({
  selector: 'tt-date-picker-sample',
  template: '<button class="dark:text-white" [(ttDatePicker)]="date">📅 {{ date|date}}</button>',
  standalone: true,
  imports: [DatePickerDirective, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerSampleComponent {
  date = new Date();
}

export default {
  title: 'DatePicker',
  component: DatePickerSampleComponent,
} as Meta<DatePickerSampleComponent>;

const Template: Story<DatePickerSampleComponent> = (args: DatePickerSampleComponent) => ({
  props: args,
});

export const Default = Template.bind({});
