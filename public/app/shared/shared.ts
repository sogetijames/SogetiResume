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
export class Constants {
	public practices: any;
	public statuses: any;
	public titles: any;
	public units: any;

	constructor() {
		FirebaseRef.child('constants').once('value', (dataSnapshot: FirebaseDataSnapshot) => {
			let data = dataSnapshot.val();
			this.practices = Object.keys(data.practices);
			this.statuses = Object.keys(data.statuses);
			this.titles = Object.keys(data.titles);
			this.units = Object.keys(data.units);
		});
	}
}

@Injectable()
export class FirebaseData {
	public users: Object;
	public skills: Object;

	constructor() {
		FirebaseRef.on('value', (dataSnapshot) => {
			let data = dataSnapshot.val();

			Object.keys(data.users).forEach((key) => {
				if (!data.users[key].active) {
					delete data.users[key];
				}
			});

			this.users = data.users;
			this.skills = data.skills;
		});
	}
}