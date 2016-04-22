import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {CurrentUser, Constants} from './currentUser';

bootstrap(AppComponent, [
	CurrentUser,
	Constants,
	ROUTER_PROVIDERS
]);