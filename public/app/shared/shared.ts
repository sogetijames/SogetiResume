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
	public users: any;
	public skills: any;

	constructor() {
		FirebaseRef.child('constants').once('value', (dataSnapshot: FirebaseDataSnapshot) => {
			let data = dataSnapshot.val();
			this.practices = Object.keys(data.practices);
			this.statuses = Object.keys(data.statuses);
			this.titles = Object.keys(data.titles);
			this.units = Object.keys(data.units);
			this.proficiency = data.proficiency;
		});

		FirebaseRef.child('users').on('value', (usersSnapshot: FirebaseDataSnapshot) => {
			let users = usersSnapshot.val();

			Object.keys(users).forEach((key) => {
				if (!users[key].active) {
					delete users[key];
				}
			});

			this.users = users;
		});

		FirebaseRef.child('skills').on('value', (skillsSnapshot: FirebaseDataSnapshot) => {
			this.skills = skillsSnapshot.val();
		});
	}
}