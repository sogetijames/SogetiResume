import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseRef } from '../shared/shared';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
	selector: 'login',
	templateUrl: './app/users/user-login.component.html',
	providers: [AuthenticationService]
})
export class LoginComponent implements OnInit { 
	email: string;
	password: string;

	constructor(
		private _router: Router, 
		private _authenticationService: AuthenticationService
	) { 
		this.email = '';
		this.password = '';
	}

	ngOnInit() {
		if (FirebaseRef.getAuth()) {
			this._router.navigate(['Profile', { username: FirebaseRef.getAuth().password.email.split('@')[0].replace('.', '_') }]);
		}
	}

	onClickLogin() {
		if (this.email != '' && this.password != '') {
			this._authenticationService.login(this.email + "@us.sogeti.com", this.password).then(
				(authData: FirebaseAuthData) => {
					this._router.navigate(['Profile', { username: this.email.replace('.', '_') }]);
				}, 
				(error: any) => {
					toastr.error(error);
				}
			);
		}
	}

	onClickCreate() {
		if (this.email != '' && this.password != '') {
			let email = this.email.toLowerCase() + "@us.sogeti.com";
			let name = this.email.toLowerCase().split('.');

			this._authenticationService.createUser(email, this.password, 
				(error: any, authData: FirebaseAuthData) => {
					if (error) {
						this.password = '';
						toastr.error(error);
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

	onClickResetPassword() {
		if (this.email != '') {
			let email = this.email.toLowerCase() + "@us.sogeti.com";
			
			FirebaseRef.resetPassword({email: email}, (error) => {
				if (error) {
					switch (error.code) {
						case "":
							toastr.error('The specified user account does not exist.');
							break;						
						default:
							toastr.error(error);
							break;
					}
				} else {
					toastr.info('Password reset email sent successfully!');
				}
			});
		} else {
			toastr.error('No email specified!');
		}
	}
}