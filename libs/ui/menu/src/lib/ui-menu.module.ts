import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuTriggerDirective } from './context-menu-trigger.directive';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [CommonModule, MatMenuModule],
  declarations: [ContextMenuTriggerDirective],
  exports: [ContextMenuTriggerDirective, MatMenuModule],
})
export class UiMenuModule {}
