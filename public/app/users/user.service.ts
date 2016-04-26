import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef} from '../shared/shared';

@Injectable()
export class UserService {
	constructor() { }

	public getUserByUid(uid: string) {
		return FirebaseRef.child('users').child(uid).once('value');
	}
	
	public getUserByUsername(username: string) {
		let email = username + '@us.sogeti.com';
		return FirebaseRef.child('users').orderByChild('email').startAt(email).endAt(email + '\uf8ff').once('value');
	}

	public getDataForUidOnce(child: string, uid: string) {
		return FirebaseRef.child(child).child(uid).once('value');
	}
}