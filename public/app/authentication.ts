import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef} from './firebase-ref';

@Injectable()
export class Authentication {
	public getLoggedInUserUid() {
		return FirebaseRef.getAuth().uid;
	}

	public login(email: string, password: string) {
		FirebaseRef.authWithPassword({
			email: email,
			password: password
		}, function (error: any, authData: FirebaseAuthData) {
			if (error) {
				return error;
			} else {
				FirebaseRef.child('users').child(authData.uid).set({
					name: authData.password.email.split('@')[0].replace('.','_')
				});
				return FirebaseRef.child('users').child(authData.uid);
			}
		});
	}

	constructor() { }
}