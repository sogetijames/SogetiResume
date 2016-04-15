import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
	selector: 'login',
	templateUrl: '../views/login.html',
})

export class LoginComponent { 
	constructor(private _router: Router) { }

	onClickLogin() {
		
	}
}