import {Injectable} from "angular2/core";

@Injectable()
export class CurrentUser {
    public auth: any = {};

    public resetCurrentUser() {
    	this.auth = {};
	}
}