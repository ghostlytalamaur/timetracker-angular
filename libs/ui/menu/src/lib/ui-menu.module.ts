import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuTriggerDirective } from './context-menu-trigger.directive';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

@NgModule({
  imports: [CommonModule, MatMenuModule],
  declarations: [ContextMenuTriggerDirective],
  exports: [ContextMenuTriggerDirective, MatMenuModule],
})
export class UiMenuModule {}
