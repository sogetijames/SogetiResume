import {Injectable} from "angular2/core";

export var FirebaseRef: Firebase = new Firebase('https://dazzling-inferno-8835.firebaseio.com');

@Injectable()
export class CurrentUser {
    public auth: any = {};
    public info: any = {};

    public resetCurrentUser() {
    	this.auth = {};
    	this.info = {};
	}
}

@Injectable()
export class FirebaseData {
	public practices: any;
	public statuses: any;
	public titles: any;
	public units: any;
	public proficiency: any;

	constructor() {
		FirebaseRef.child('constants').once('value', (dataSnapshot: FirebaseDataSnapshot) => {
			let data = dataSnapshot.val();
			this.practices = Object.keys(data.practices);
			this.proficiency = data.proficiency;
			this.statuses = Object.keys(data.statuses);
			this.titles = Object.keys(data.titles);
			this.units = Object.keys(data.units);
		});
	}

	public getDataOnce(child: string) {
		return FirebaseRef.child(child).once('value');
	}
}