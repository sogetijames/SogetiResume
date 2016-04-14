import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AngularFire, FirebaseAuth} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {Authentication} from './authentication';
import {UserDetailComponent} from './user-detail.component';
import {NavComponent} from './nav.component';
import {FooterComponent} from './footer.component';
import {UserService} from './user.service';
import {ValuesPipe} from './values.pipe';

@Component({
	selector: 'my-app',
	providers: [Authentication, UserService],
	templateUrl: "../views/profile.html",
	directives: [ROUTER_DIRECTIVES, UserDetailComponent, NavComponent, FooterComponent],
	pipes: [ValuesPipe]
})
@RouteConfig([

])

export class AppComponent implements OnInit {
	users: Object;

	constructor(private _userService: UserService, private _authentication: Authentication) { }

	getUsers() {
		this._userService.getUsers().then( users => this.users = users.val() );
	}
	
	ngOnInit() {
		this.getUsers();
	}
}