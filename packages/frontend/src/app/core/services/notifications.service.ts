import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private readonly toastr: ToastrService,
  ) {
  }

  info(message: string): number {
    return this.toastr.info(message).toastId;
  }

  success(message: string): number {
    return this.toastr.success(message).toastId;
  }

  warning(message: string): number {
    return this.toastr.warning(message).toastId;
  }

  error(message: string): number {
    return this.toastr.error(message).toastId;
  }

  clear(id: number): void {
    this.toastr.clear(id);
  }
}
