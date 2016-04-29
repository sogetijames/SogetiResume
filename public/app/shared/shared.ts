import {Injectable, NgZone} from "angular2/core";

export var FirebaseRef: Firebase = new Firebase('https://dazzling-inferno-8835.firebaseio.com');

export function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
    	var result: any;
    	if (typeof a[property] === 'string') {
    		result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;

    	} else {
    		result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    	}
        return result * sortOrder;
    }
}

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
		['practices', 'proficiency', 'statuses', 'titles', 'units'].forEach((key) => {
			FirebaseRef.child('constants').child(key).on('value', (dataSnapshot) => {
				this[key] = dataSnapshot.val();
			})
		});	
	}

	public getDataOnce(child: string) {
		return FirebaseRef.child(child).once('value');
	}
}