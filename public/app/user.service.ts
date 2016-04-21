import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef, FirebaseRefUsers} from './firebase-ref';

@Injectable()
export class UserService {
	constructor() { }

	public getUser(uid: string) {
		return FirebaseRef.child('users').child(uid).once('value');
	}
	
	public getUserByUsername(username: string) {
		let email = username + '@us.sogeti.com';
		return FirebaseRef.child('users').orderByChild('email').startAt(email).endAt(email + '\uf8ff').once('value');
	}

	public getSkills(uid: string) {
		return FirebaseRef.child('skills').child(uid).once('value');
	}
}