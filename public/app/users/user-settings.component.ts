import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {CurrentUser, FirebaseRef} from '../shared/shared';
import {AuthenticationService} from '../shared/authentication.service';
import {UserService} from './user.service';

@Component({
	selector: 'user-settings',
	templateUrl: '../../views/user-settings.component.html',
	providers: [ 
		UserService
	],
})
export class UserSettingsComponent implements OnInit {
	private oldPassword: any;
	private newPassword1: any;
	private newPassword2: any;

	constructor(
		private _currentUser: CurrentUser,
		private _router: Router,
		private _authenticationService: AuthenticationService
	) { } 

	ngOnInit() {
		if (!FirebaseRef.getAuth()) {
			this._router.navigate(['Login']);
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
		let email = this._currentUser.auth.password.email;
		let oldPassword = this.oldPassword;
		let newPassword = this.newPassword1;

		if (this.newPassword1 == this.newPassword2) {
			this._authenticationService.changePassword(email, oldPassword, newPassword, (error: any) => {
				if (error === null) {
					console.log("Password changed successfully");
				} else {
					console.log("Error changing password:", error);
				}
			});
		} else {
			console.log("New Passwords do not match.");
		}	
		
		this.resetPasswordFields();
	}
}