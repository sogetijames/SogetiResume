import { Injectable } from "@angular/core";

@Injectable()
export class CurrentUser {
    public auth: any = {};
    public info: any = {};

    public resetCurrentUser() {
      this.auth = {};
      this.info = {};
  }
}