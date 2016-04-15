import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef} from './firebase-ref';

@Injectable()
export class AuthenticationService {

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