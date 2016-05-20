import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { FIREBASE_REF, CurrentUser } from '../../shared';
import { AuthenticationService } from '../';

@Component({
	selector: 'user-login',
	templateUrl: './app/+users/user-login/user-login.component.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [AuthenticationService]
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
		if (firebase.auth().currentUser) {
			this.router.navigate(['/resume', this.currentUser.info.username]);
		}
		
		this.email = '';
		this.password = '';
	}

	onClickLogin() {
		if (this.email != '' && this.password != '') {
			this.authenticationService.signIn(this.email, this.password, (error: any) => {
				if (error) {
					toastr.error(error.message, error.code);
				} else {
					this.router.navigate(['/resume', this.currentUser.info.username]);
				}
			});
		}
	}
}