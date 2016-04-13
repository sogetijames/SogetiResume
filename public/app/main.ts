import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {
	FIREBASE_PROVIDERS, 
	defaultFirebase, 
	firebaseAuthConfig,
	AuthProviders,
	AuthMethods,
	AngularFire
} from 'angularfire2';

bootstrap(AppComponent, [
	FIREBASE_PROVIDERS,
	defaultFirebase('https://dazzling-inferno-8835.firebaseio.com'),
	firebaseAuthConfig({
		provider: AuthProviders.Password,
		method: AuthMethods.Password,
		remember: 'default',
		scope: ['email']
	}),
	ROUTER_PROVIDERS
]);