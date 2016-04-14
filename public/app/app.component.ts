import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AngularFire, FirebaseAuth} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {Authentication} from './authentication';
import {UserDetailComponent} from './user-detail.component';

@Component({
	selector: 'my-app',
	providers: [Authentication],
	templateUrl: "../views/profile.html",
	directives: [ROUTER_DIRECTIVES, UserDetailComponent],
	pipes: []
})
@RouteConfig([

])

export class AppComponent {
	users: Observable<any[]>;

	constructor(af: AngularFire, private _auth: FirebaseAuth) {
		this.users = af.database.list('/users');
		console.log(this.users);
		// var auth = new Authentication(this._auth);
		// auth.login("james.garcia@us.sogeti.com", "password");
	}
}