import {Injectable} from "angular2/core";

@Injectable()
export class CurrentUser {
    private user: any;

    constructor() {}

    setCurrentUser(user: any) {
        this.user = user;
    }

    getCurrentUser() {
        return this.user;
    }
}