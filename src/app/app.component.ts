import { Component, OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentUser, FirebaseRef } from './shared/shared';
import { AuthenticationService } from './shared/authentication.service';

import { UserDetailComponent } from './users/user-detail.component';
import { LoginComponent } from './users/user-login.component';
import { SearchComponent } from './users/user-search.component';
import { UserSettingsComponent } from './users/user-settings.component';
import { UserService } from './users/user.service';

import { AdminComponent } from './admin/admin.component';

@Component({
	selector: 'my-app',
	templateUrl: "./app/app.component.html",
	providers: [
		ROUTER_PROVIDERS, 
		UserService,
		AuthenticationService
	],
	directives: [
		ROUTER_DIRECTIVES
	]
})
@Routes([
	{ path: '/', 									component: SearchComponent },
	{ path: '/login', 						component: LoginComponent },
	{ path: '/admin', 						component: AdminComponent },
	{ path: '/settings', 					component: UserSettingsComponent },
	{ path: '/profile/:username', component: UserDetailComponent },
	{ path: '*', 									component: SearchComponent }
])
export class AppComponent implements OnInit {

	ngOnInit() {
		toastr.options.positionClass = "toast-top-right";

		if (FirebaseRef.getAuth()) {
			this.currentUser.auth = FirebaseRef.getAuth();
			this.setCurrentUserInfo(this.currentUser.auth.uid);
		}

		FirebaseRef.onAuth((authData: FirebaseAuthData) => {
			if (authData != null) {
				this.currentUser.auth = authData;
				this.setCurrentUserInfo(authData.uid);
			}
		});	
	}

	constructor(
		private currentUser: CurrentUser,
		private userService: UserService, 
		private authenticationService: AuthenticationService ) { }

	onClickLogout() {
		this.authenticationService.logout();
		this.currentUser.resetCurrentUser();
	}

	private setCurrentUserInfo(uid: string) {
		FirebaseRef.child('users').child(uid).on('value', info => {
			this.currentUser.info = info.val();
			this.currentUser.info.username = this.currentUser.info.email.split('@')[0].replace('.', '_');
		});
	}
}