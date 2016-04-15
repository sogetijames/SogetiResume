import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';

import {UserService} from './user.service';

@Component({
	selector: 'user-detail',
	templateUrl: '../views/profile.html',
	providers: [ 
		UserService
	],
})

export class UserDetailComponent implements OnInit {
	user: Object

	constructor(private _router: Router, private _userService: UserService) { }

	ngOnInit() {
		if (FirebaseRef.getAuth()) {
			this._userService.getUser(FirebaseRef.getAuth().uid).then( user => this.user = user.val() );
		} else {
			this._router.navigate(['Login']);
		}
	}
}