import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule } from '@app/core/auth';
import { SharedModule } from '@app/shared';
import { ToastrModule } from 'ngx-toastr';
import { AppDataContainerComponent } from './containers';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { appInitializerFactory } from './services';

@NgModule({
  declarations: [PageNotFoundComponent, AppDataContainerComponent],
  exports: [AuthModule],
  imports: [CommonModule, HttpClientModule, AuthModule, SharedModule, ToastrModule.forRoot()],
  providers: [{ provide: APP_INITIALIZER, useFactory: appInitializerFactory, multi: true }],
})
export class CoreModule {}
