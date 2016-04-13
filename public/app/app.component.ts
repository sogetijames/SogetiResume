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
		this.doLogin("james.garcia@us.sogeti.com", "password");

		var firebase = new Firebase('https://dazzling-inferno-8835.firebaseio.com');

		firebase.onAuth(function(authData) {
			firebase.child('users').child(authData.uid).set({
				provider: authData.provider,
				name: authData.password.email.split('@')[0].replace('.','_')
			})
		});
	}

	public doLogin (email: string, password: string) {
		this._auth.login({
			email: email,
			password: password
		});
	}
}