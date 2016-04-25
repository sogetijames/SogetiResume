import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {CurrentUser, Constants, FirebaseRef} from './shared/shared';
import {AuthenticationService} from './shared/authentication.service';
import {ValuesPipe} from './shared/pipe';

import {UserDetailComponent} from './users/user-detail.component';
import {LoginComponent} from './users/user-login.component';
import {SearchComponent} from './users/user-search.component';
import {UserSettingsComponent} from './users/user-settings.component';
import {UserService} from './users/user.service';

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
	],
	pipes: [
		ValuesPipe
	]
})
@RouteConfig([
	{
		path: '/profile/:username',
		name: 'Profile',
		component: UserDetailComponent
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginComponent,
		useAsDefault: true
	},
	{
		path: '/search',
		name: 'Search',
		component: SearchComponent
	},
	{
		path: '/settings',
		name: 'Settings',
		component: UserSettingsComponent
	}
])
export class AppComponent {

	constructor(
		private _currentUser: CurrentUser,
		private _router: Router, 
		private _userService: UserService, 
		private _authenticationService: AuthenticationService,
		private _constants: Constants
	) { 
		if (FirebaseRef.getAuth()) {
			this._currentUser.auth = FirebaseRef.getAuth();
			this.setCurrentUserInfo(this._currentUser.auth.uid);
		}

		FirebaseRef.onAuth( (authData: FirebaseAuthData) => {
			if (authData != null) {
				this._currentUser.auth = authData;
				this.setCurrentUserInfo(authData.uid);
			}
		});

		FirebaseRef.child('constants').once('value', (dataSnapshot: FirebaseDataSnapshot) => {
			let data = dataSnapshot.val();
			this._constants.practices = Object.keys(data.practices);
			this._constants.statuses = Object.keys(data.statuses);
			this._constants.titles = Object.keys(data.titles);
			this._constants.units = Object.keys(data.units);
		});
	}

	onClickLogout() {
		this._authenticationService.logout();
		this._currentUser.resetCurrentUser();
	}

	private setCurrentUserInfo(uid: string) {
		this._userService.getUser(uid).then(info => {
			this._currentUser.info = info.val();
			this._currentUser.info.username = this._currentUser.info.email.split('@')[0].replace('.', '_');
		});
	}
}