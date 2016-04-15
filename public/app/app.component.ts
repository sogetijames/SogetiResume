import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {LoginComponent} from './login.component';
import {UserDetailComponent} from './user-detail.component';
import {FooterComponent} from './footer.component';

import {UserService} from './user.service';

import {ValuesPipe} from './values.pipe';

@Component({
	selector: 'my-app',
	providers: [
		ROUTER_PROVIDERS, 
		UserService
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
	users: Object;

	constructor(private _router: Router, private _userService: UserService) { }

	getUsers() {
		this._userService.getUsers().then( users => this.users = users.val() );
	}
	
	onClickLogin() { 
		let link = ['Login'];
  		this._router.navigate(link);
	}
}