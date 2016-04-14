import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AngularFire, FirebaseAuth} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {Authentication} from './authentication';

@Component({
	selector: 'my-app',
	providers: [Authentication],
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

		var auth = new Authentication(this._auth);
		auth.login("james.garcia@us.sogeti.com", "password");
	}
}