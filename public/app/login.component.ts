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

	constructor(
		private _router: Router, 
		private _authenticationService: AuthenticationService
	) { }

	ngOnInit() {
		if (FirebaseRef.getAuth()) {
			this._router.navigate(['Profile', { username: FirebaseRef.getAuth().password.email.split('@')[0].replace('.', '_') }]);
		}
	}

	onClickLogin() {
		this._authenticationService.login(this.email + "@us.sogeti.com", this.password).then(
			(authData: FirebaseAuthData) => {
				this._router.navigate(['Profile', { username: this.email.replace('.', '_') }]);
			}, 
			(error: any) => {
				console.log(error);
			}
		);
	}

	onClickCreate() {
		let email = this.email.toLowerCase() + "@us.sogeti.com";
		let name = this.email.toLowerCase().split('.');

		this._authenticationService.createUser(email, this.password, 
			(error: any, authData: FirebaseAuthData) => {
				if (error) {
					console.log(error);
				} else {
					FirebaseRef.child('/users').child(authData.uid).update({
						active: true,
						admin: false,
						bio: '',
						email: email,
						first: name[0],
						last: name[1],
						practice: '',
						profileImageURL: authData.password.profileImageURL.replace("?d=retro","?s=250"),
						status: {
							description: '',
							text: ''
						},
						title: '',
						unit: ''
					});

					this.onClickLogin();
				}			
			}
		);
	}
}