import {Injectable} from "angular2/core";

@Injectable()
export class CurrentUser {
    public auth: any = {};
    public info: any = {};

    public resetCurrentUser() {
    	this.auth = {};
    	this.info = {};
	}
}