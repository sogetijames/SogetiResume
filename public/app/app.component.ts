import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {Observable} from 'rxjs/Observable';
import {LoginComponent} from './login.component';
import {UserDetailComponent} from './user-detail.component';
import {FooterComponent} from './footer.component';
import {UserService} from './user.service';
import {AuthenticationService} from './authentication.service';
import {ValuesPipe} from './values.pipe';
import {FirebaseRef} from './firebase-ref';
import {SearchComponent} from './search.component';
import {CurrentUser} from './currentUser';
import {UserSettingsComponent} from './user-settings.component';

@Component({
	selector: 'my-app',
	providers: [
		ROUTER_PROVIDERS, 
		UserService,
		AuthenticationService
	],
	templateUrl: "../views/nav.html",
	directives: [
		ROUTER_DIRECTIVES, 
		FooterComponent
	],
	pipes: [
		ValuesPipe
	]
})
@RouteConfig([
	{
		path: '/profile',
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
		private _authenticationService: AuthenticationService) { 

		FirebaseRef.onAuth( (authData: FirebaseAuthData) => {
			if (authData != null) {
				this._currentUser.auth = authData;

				this._userService.getUser(authData.uid).then(
					info => {
						this._currentUser.info = info.val();
						this._currentUser.auth.password.profileImageURL = this._currentUser.auth.password.profileImageURL.replace("?d=retro","?s=250");
					}
				);

				this._userService.searchBioByUID(authData.uid).then(
					bio => this._currentUser.bio = bio.val()
				);
			}
		});
	}

	onClickLogout() {
		this._authenticationService.logout();
		this._currentUser.resetCurrentUser();
  		this._router.navigate(['Login']);
	}	
}