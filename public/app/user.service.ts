import {Injectable, Inject} from 'angular2/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {FirebaseRef, FirebaseRefUsers} from './firebase-ref';

@Injectable()
export class UserService {
	constructor(@Inject(AngularFire) public _af: AngularFire) { }

	public getUsers() {
		return FirebaseRef.child('/users').once("value");
	}

	public getUser(uid: string) {
		return FirebaseRef.child('/users').child(uid).once("value");
	}

	public updateUser(user: Object) {
		
	}

	public searchUsersByFirstName(name: string){
		name = name.toLowerCase();
		var firstnameSearch = FirebaseRefUsers.orderByChild("first").startAt(name).endAt(name + "\uf8ff").once("value");
		return  firstnameSearch;
	}

	public searchUsersByLastName(name: string){
		name = name.toLowerCase();
		var lastnameSearch = FirebaseRefUsers.orderByChild("last").startAt(name).endAt( name+ "\uf8ff").once("value") ;
		return  lastnameSearch;
	}
}