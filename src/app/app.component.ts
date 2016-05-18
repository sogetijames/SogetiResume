import { Component, OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AdminComponent } from './+admin';
import { ResumeDetailComponent, ResumesComponent } from './+resumes';
import { AuthenticationService, UserLoginComponent, UserSettingsComponent } from './+users';
import { CurrentUser, FIREBASE_REF } from './shared';

@Component({
	selector: 'sogeti-resume',
	templateUrl: "./app/app.component.html",
	providers: [
		ROUTER_PROVIDERS, 
		AuthenticationService
	],
	directives: [
		ROUTER_DIRECTIVES
	]
})
@Routes([
	{ path: '/', 								 component: ResumesComponent },
	{ path: '/login', 					 component: UserLoginComponent },
	{ path: '/admin', 					 component: AdminComponent },
	{ path: '/settings', 				 component: UserSettingsComponent },
	{ path: '/resume/:username', component: ResumeDetailComponent },
	{ path: '*', 								 component: ResumesComponent }
])
export class AppComponent implements OnInit {

	ngOnInit() {
		toastr.options.positionClass = "toast-top-right";

		let authData = FIREBASE_REF.getAuth();

		if (authData) {
			this.setCurrentUserInfo(authData.uid);
			this.currentUser.auth = authData;
		}

		FIREBASE_REF.onAuth((authData: FirebaseAuthData) => {
			if (authData != null) {
				this.setCurrentUserInfo(authData.uid);
				this.currentUser.auth = authData;
			}
		});	
	}

	constructor(
		private currentUser: CurrentUser,
		private authenticationService: AuthenticationService ) { }

	onClickLogout() {
		this.authenticationService.logout();
		this.currentUser.resetCurrentUser();
	}

	private setCurrentUserInfo(uid: string) {
		FIREBASE_REF.child('users').child(uid).on('value', info => {
			this.currentUser.info = info.val();
			this.currentUser.info.username = this.currentUser.info.email.split('@')[0].replace('.', '_');
		});
	}
}