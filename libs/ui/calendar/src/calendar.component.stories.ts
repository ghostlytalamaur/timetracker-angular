import { Meta, Story } from '@storybook/angular';
import { addDays } from 'date-fns';
import { CalendarComponent } from './calendar.component';

export default {
  title: 'Calendar',
  component: CalendarComponent,
} as Meta<CalendarComponent>;

const Template: Story<CalendarComponent> = (args: CalendarComponent) => ({
  props: args,
});

export const Today = Template.bind({});

export const SelectedDate = Template.bind({});
SelectedDate.args = {
  date: new Date(1991, 3, 29),
};

export const Tomorrow = Template.bind({});
Tomorrow.args = {
  date: addDays(new Date(), 1),
};
