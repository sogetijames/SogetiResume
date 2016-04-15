import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {CurrentUser} from './currentUser';

import {UserService} from './user.service';

@Component({
	selector: 'user-detail',
	templateUrl: '../views/profile.html',
	providers: [ 
		UserService
	],
})

export class UserDetailComponent implements OnInit {

	constructor(
		private _currentUser: CurrentUser,
		private _router: Router, 
		private _userService: UserService
	) { } 

	ngOnInit() {
		if (!FirebaseRef.getAuth()) {
			this._router.navigate(['Login']);
		}
	}
}