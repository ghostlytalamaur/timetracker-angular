import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ResolvedTemplateDirective,
  StatusContainerComponent,
} from './status-container/status-container.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  declarations: [ResolvedTemplateDirective, StatusContainerComponent],
  exports: [ResolvedTemplateDirective, StatusContainerComponent],
})
export class UiStatusModule {}
