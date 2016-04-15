import {Injectable, Inject} from 'angular2/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {FirebaseRef} from './firebase-ref';

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
}