import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {AuthenticationService} from './authentication.service';

@Component({
	selector: 'login',
	templateUrl: '../views/login.html',
	providers: [AuthenticationService]
})

export class LoginComponent { 
	email: string;
	password: string;

	constructor(private _router: Router, private _authenticationService: AuthenticationService) { 
		this._authenticationService.logout();
	}

	onClickLogin() {
		this._authenticationService.login(this.email + "@us.sogeti.com", this.password).then(
			(authData: FirebaseAuthData) => {
				var name = authData.password.email.split('@')[0].split('.');

				FirebaseRef.child('users').child(authData.uid).update({
					first: name[0].toLowerCase(),
					last: name[1].toLowerCase()
				});

				this._router.navigate(['Profile']);
			}, 
			(error: any) => {
				console.log(error);
			}
		);
	}
}