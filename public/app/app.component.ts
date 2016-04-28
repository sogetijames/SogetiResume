import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {CurrentUser, FirebaseRef} from './shared/shared';
import {AuthenticationService} from './shared/authentication.service';

import {UserDetailComponent} from './users/user-detail.component';
import {LoginComponent} from './users/user-login.component';
import {SearchComponent} from './users/user-search.component';
import {UserSettingsComponent} from './users/user-settings.component';
import {UserService} from './users/user.service';

import {AdminComponent} from './admin/admin.component'

@Component({
	selector: 'my-app',
	providers: [
		ROUTER_PROVIDERS, 
		UserService,
		AuthenticationService
	],
	templateUrl: "../views/app.component.html",
	directives: [
		ROUTER_DIRECTIVES
	]
})
@RouteConfig([
	{
		path: '/',
		name: 'Search',
		component: SearchComponent,
		useAsDefault: true
	},
	{
		path: '/profile/:username',
		name: 'Profile',
		component: UserDetailComponent
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginComponent
	},
	{
		path: '/settings',
		name: 'Settings',
		component: UserSettingsComponent
	},
	{
		path: '/admin',
		name: 'Admin',
		component: AdminComponent
	}
])
export class AppComponent implements OnInit {

	ngOnInit() {
		toastr.options.positionClass = "toast-top-right";

		if (FirebaseRef.getAuth()) {
			this._currentUser.auth = FirebaseRef.getAuth();
			this.setCurrentUserInfo(this._currentUser.auth.uid);
		}

		FirebaseRef.onAuth((authData: FirebaseAuthData) => {
			if (authData != null) {
				this._currentUser.auth = authData;
				this.setCurrentUserInfo(authData.uid);
			}
		});	
	}

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private _authenticationService: AuthenticationService ) { }

	onClickLogout() {
		this._authenticationService.logout();
		this._currentUser.resetCurrentUser();
	}

	private setCurrentUserInfo(uid: string) {
		this._userService.getUserByUid(uid).then(info => {
			this._currentUser.info = info.val();
			this._currentUser.info.username = this._currentUser.info.email.split('@')[0].replace('.', '_');
		});
	}
}