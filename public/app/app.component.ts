import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AngularFire, AuthProviders, FirebaseAuth} from 'angularfire2';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'my-app',
	providers: [],
	template: 
	`<ul *ngFor="#item of items | async">
		<li class="text">
			{{item.first}}
		</li>
	</ul>`,
	directives: [ROUTER_DIRECTIVES],
	pipes: []
})
@RouteConfig([

])

export class AppComponent {
	items: Observable<any[]>;

	constructor(af: AngularFire, private _auth: FirebaseAuth) {
		this.items = af.database.list('/users');
		this.doLogin();
	}

	public doLogin () {
		this._auth.login({
			provider: AuthProviders.Password
		});
	}
}