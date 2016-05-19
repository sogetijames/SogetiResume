import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { FIREBASE_REF, CurrentUser } from '../../shared';
import { AuthenticationService } from '../';

@Component({
	selector: 'user-login',
	templateUrl: './app/+users/user-login/user-login.component.html',
	directives: [ROUTER_DIRECTIVES]
})
export class UserLoginComponent implements OnInit { 
	email: string;
	password: string;

	constructor(
		private router: Router, 
		private authenticationService: AuthenticationService,
		private currentUser: CurrentUser
	) { }

	ngOnInit() {
		let authData = FIREBASE_REF.getAuth();

		if (authData) {
			this.router.navigate(['/resume', this.currentUser.info.username]);
		}
		
		this.email = '';
		this.password = '';
	}

	onClickLogin() {
		if (this.email != '' && this.password != '') {
			this.authenticationService.login(this.email, this.password).then(
				(authData: FirebaseAuthData) => this.router.navigate(['/resume', this.currentUser.info.username]), 
				(error: any) => toastr.error(error) 
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