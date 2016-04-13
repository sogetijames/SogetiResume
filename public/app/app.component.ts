import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Observable';


@Component({
	selector: 'my-app',
	providers: [],
	templateUrl: '/views/home.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: []
})
@RouteConfig([

])

export class AppComponent {
	root: Observable<any[]>;
	constructor(af: AngularFire) {
		this.root = af.list('/');
	}
}