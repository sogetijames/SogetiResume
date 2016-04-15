import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef} from './firebase-ref';

@Injectable()
export class AuthenticationService {

	public createUser(email: string, password: string, callback) {
		return FirebaseRef.createUser({
			email: email,
			password: password
		}, (error: any, authData: FirebaseAuthData) => {
			callback(error, authData);
		});
	}

	public login(email: string, password: string) {
		return FirebaseRef.authWithPassword({
			email: email,
			password: password
		});
	}

	public logout() {
		FirebaseRef.unauth();
	}
}