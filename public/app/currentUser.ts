import {Injectable} from "angular2/core";

@Injectable()
export class CurrentUser {
    public user: any = {
    	auth: {},
    	info: {}
    }

    public resetCurrentUser() {
    	this.user = {
	    	auth: {},
	    	info: {}
	    };
	}
}