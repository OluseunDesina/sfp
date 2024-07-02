import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastrService: ToastrService) {}

  // Success Type
  success(title = `Success!`, message = "successful") {
    this.toastrService.success(message, title, {
      positionClass: "toast-top-center",
    });
  }

  // info Type
  info(title = `Info`, message = "") {
    this.toastrService.info(message, title, {
      positionClass: "toast-top-center",
    });
  }

  // warning Type
  warning(title = `Warning!`, message = "please try again") {
    this.toastrService.warning(message, title, {
      positionClass: "toast-top-center",
    });
  }

  // danger Type
  danger(title = `Error!`, message = "An unknown error occured") {
    this.toastrService.error(message, title, {
      positionClass: "toast-top-center",
    });
  }
}
