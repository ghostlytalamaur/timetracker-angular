import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public constructor(
    private readonly toastr: ToastrService,
  ) {
  }

  public info(message: string): number {
    return this.toastr.info(message).toastId;
  }

  public success(message: string): number {
    return this.toastr.success(message).toastId;
  }

  public warning(message: string): number {
    return this.toastr.warning(message).toastId;
  }

  public error(message: string): number {
    return this.toastr.error(message).toastId;
  }

  public clear(id: number): void {
    this.toastr.clear(id);
  }
}
