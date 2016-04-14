import {Injectable, Inject} from 'angular2/core';
import {FirebaseAuth} from 'angularfire2';

@Injectable()
export class Authentication {
	public login(email: string, password: string) {
		this._auth.login({
			email: email,
			password: password
		});
	}

	constructor(@Inject(FirebaseAuth) public _auth: FirebaseAuth) {
		var firebase = new Firebase('https://dazzling-inferno-8835.firebaseio.com');

		firebase.onAuth(function(authData) {
			firebase.child('users').child(authData.uid).set({
				provider: authData.provider,
				name: authData.password.email.split('@')[0].replace('.','_')
			})
		});
	}
}