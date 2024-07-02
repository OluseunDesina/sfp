import { Injectable } from "@angular/core";
import { fromEvent, merge, Observable, Observer, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  private errorListener = new Subject<string>();

  // get listeener
  getErrorListener() {
    return this.errorListener.asObservable();
  }

  throwError(message: string) {
    this.errorListener.next(message);
  }

  // handleError() {
  //   this.errorListener.next(null);
  // }

  handleError(message) {
    if (message || message !== "") {
      this.throwError(message);
    } else {
      this.throwError("An Unknown Error occurred");
    }
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, "offline").pipe(map(() => false)),
      fromEvent(window, "online").pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }
}
