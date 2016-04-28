import {Injectable, NgZone} from "angular2/core";

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
	private zone: NgZone;
	public practices: any;
	public statuses: any;
	public titles: any;
	public units: any;
	public proficiency: any;

	constructor() {
		this.zone = new NgZone({enableLongStackTrace: false});

		['practices', 'proficiency', 'statuses', 'titles', 'units'].forEach((key) => {
			FirebaseRef.child('constants').child(key).on('value', (dataSnapshot) => {
				this.zone.run(() => {
					this[key] = dataSnapshot.val();
				});
			})
		});	
	}

	public getDataOnce(child: string) {
		return FirebaseRef.child(child).once('value');
	}
}