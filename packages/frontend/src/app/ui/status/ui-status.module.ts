import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ResolvedTemplateDirective,
  StatusContainerComponent,
} from './status-container/status-container.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  declarations: [ResolvedTemplateDirective, StatusContainerComponent],
  exports: [ResolvedTemplateDirective, StatusContainerComponent],
})
export class UiStatusModule {}
