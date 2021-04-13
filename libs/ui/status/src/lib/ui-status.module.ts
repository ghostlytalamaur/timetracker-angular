import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ResolvedTemplateDirective,
  StatusContainerComponent,
} from './status-container/status-container.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
  declarations: [ResolvedTemplateDirective, StatusContainerComponent],
  exports: [ResolvedTemplateDirective, StatusContainerComponent],
})
export class UiStatusModule {}
