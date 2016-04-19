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

	bio: Object;

	constructor(
		private _currentUser: CurrentUser,
		private _router: Router, 
		private _userService: UserService
	) { 
		this._userService.searchBioByUID(FirebaseRef.getAuth().uid).then(
			returnedBio => {
				this.bio = returnedBio.val();
			}
		);
	} 

	ngOnInit() {
		if (!FirebaseRef.getAuth()) {
			this._router.navigate(['Login']);
		}
	}
}