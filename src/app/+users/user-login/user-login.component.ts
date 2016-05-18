import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FIREBASE_REF } from '../../shared';
import { AuthenticationService } from '../';

@Component({
	selector: 'user-login',
	templateUrl: './app/+users/user-login/user-login.component.html'
})
export class UserLoginComponent implements OnInit { 
	email: string;
	password: string;

	constructor(
		private router: Router, 
		private authenticationService: AuthenticationService
	) { 
		this.email = '';
		this.password = '';
	}

	ngOnInit() {
		let authData = FIREBASE_REF.getAuth();

		if (authData) {
			this.router.navigate(['/resume', authData.password.email.split('@')[0].replace('.', '_')]);
		}
	}

	onClickLogin() {
		if (this.email != '' && this.password != '') {
			this.authenticationService.login(this.email + "@us.sogeti.com", this.password).then(
				(authData: FirebaseAuthData) => {
					this.router.navigate(['/resume', this.email.replace('.', '_')]);
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

			this.authenticationService.createUser(email, this.password, 
				(error: any, authData: FirebaseAuthData) => {
					if (error) {
						this.password = '';
						toastr.error(error);
					} else {
						FIREBASE_REF.child('/users').child(authData.uid).update({
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
			
			FIREBASE_REF.resetPassword({email: email}, (error) => {
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