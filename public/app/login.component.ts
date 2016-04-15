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
				this._router.navigate(['Profile']);
			}, 
			(error: any) => {
				console.log(error);
			}
		);
	}

	onClickCreate() {
		this._authenticationService.createUser(this.email + "@us.sogeti.com", this.password, 
			(error: any, authData: FirebaseAuthData) => {
				if (error) {
					console.log(error);
				} else {
					var name = this.email.split('.');

					FirebaseRef.child('/users').child(authData.uid).update({
						first: name[0].toLowerCase(),
						last: name[1].toLowerCase()
					});

					this.onClickLogin();
				}			
			}
		);
	}
}