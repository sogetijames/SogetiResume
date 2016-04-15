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
	}
])

export class AppComponent {
	currentUser: Object;
	searchResults: Object;
	searchText: String;

	constructor(private _router: Router, 
		private _userService: UserService, 
		private _authenticationService: AuthenticationService) { 

		FirebaseRef.onAuth( (authData: FirebaseAuthData) => {
			if (authData != null) {
				this._userService.getUser(authData.uid).then(user => this.currentUser = user.val());
			}
		});
	}

	onClickLogout() {
		this._authenticationService.logout();
  		this._router.navigate(['Login']);
	}	

  	// without strong typing
	searchUsersByName(event: any) {
		var first: Object;
		var last: Object;
		var searchText = (<HTMLInputElement>event.target).value;
		console.log(searchText);
		this._userService.searchUsersByFullName(searchText).then(
			firstname => {
				first = firstname.val();
				this._userService.searchUsersByLastName(searchText).then( 
					lastname => {
						last = lastname.val();
						this.searchResults = $.extend({}, first, last);
					}
				);
			}			
		);		
	}
}