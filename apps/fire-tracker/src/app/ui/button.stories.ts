import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'tt-button',
  template: '<button class="btn">{{ text }}</button>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ButtonComponent {
  @Input()
  text = '';
}

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  args: {
    text: 'test',
  },
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ButtonComponent>;

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  text: 'Click me!',
};
