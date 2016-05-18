import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUser, FIREBASE_REF } from '../../shared';
import { AuthenticationService } from '../';

@Component({
	selector: 'user-settings',
	templateUrl: './app/+users/user-settings/user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
	private oldPassword: any;
	private newPassword1: any;
	private newPassword2: any;

	constructor(
		private currentUser: CurrentUser,
		private router: Router,
		private authenticationService: AuthenticationService
	) { } 

	ngOnInit() {
		if (!FIREBASE_REF.getAuth()) {
			this.router.navigate(['/login']);
		}
	}	

	passwordsMatch() {
		return ((this.newPassword1 != undefined && this.newPassword1 != '') && this.newPassword1 == this.newPassword2);
	}

	passwordsDifferent() {
		return ((this.newPassword1 != undefined && this.newPassword1 != '') && this.newPassword1 != this.newPassword2);
	}

	private resetPasswordFields() {
		this.oldPassword = '';
		this.newPassword1 = '';
		this.newPassword2 = '';		
	}

	changePassword() {
		let email = this.currentUser.info.email;
		let oldPassword = this.oldPassword;
		let newPassword = this.newPassword1;

		if (this.newPassword1 == this.newPassword2) {
			this.authenticationService.changePassword(email, oldPassword, newPassword, (error: any) => {
				if (error === null) {
					toastr.success("Password changed successfully!");
				} else {
					toastr.error(error);
				}
				this.resetPasswordFields();
			});
		} else {
			toastr.error('Error: Passwords do not match!');
			this.resetPasswordFields();
		}	
	}
}