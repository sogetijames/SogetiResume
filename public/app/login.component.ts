import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {AuthenticationService} from './authentication.service';

@Component({
	selector: 'login',
	templateUrl: '../views/login.html',
	providers: [AuthenticationService]
})

export class LoginComponent implements OnInit { 
	email: string;
	password: string;

	constructor(private _router: Router, private _authenticationService: AuthenticationService) { }

	ngOnInit() {
		if (FirebaseRef.getAuth()) {
			this._router.navigate(['Profile']);
		}
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
						fullname: name[0].toLowerCase() + ' ' + name[1].toLowerCase(),
						first: name[0].toLowerCase(),
						last: name[1].toLowerCase()
					});

					this.onClickLogin();
				}			
			}
		);
	}
}