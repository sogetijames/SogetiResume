import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {CurrentUser} from './currentUser';
import {UserService} from './user.service';
import {ValuesPipe} from './values.pipe';

@Component({
	selector: 'user-detail',
	templateUrl: '../views/profile.html',
	providers: [ 
		UserService,
		ValuesPipe
	]
})
export class UserDetailComponent implements OnInit {
	editable: boolean;
	uid: string;
	user: any;
	userCopy: any;

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private _routeParams: RouteParams,
		private _router: Router,
		private _valuesPipe: ValuesPipe
	) {  
		this.editable = false;

		let username = this._routeParams.get('username');
		this._userService.getUserByUsername(username.replace('_', '.')).then( user => {
			this.uid = Object.keys(user.val())[0];
			this.user = this._valuesPipe.transform(user.val())[0];
			this.user.profileImageURL = this.user.profileImageURL + "?s=250";
			this.userCopy = $.extend(true, {}, this.user);
		});
	} 

	ngOnInit() {
		if (!FirebaseRef.getAuth()) {
			this._router.navigate(['Login']);
		}
	}	

	clickEdit() {
		this.editable = !this.editable;
	}

	clickSave() {
		let userRef = FirebaseRef.child('users');
		let userObj = {};

		this.user.fullname = this.user.first + ' ' + this.user.last;

		userObj[this._currentUser.auth.uid + '/bio'] = this.user.bio;
		userObj[this._currentUser.auth.uid + '/first'] = this.user.first;
		userObj[this._currentUser.auth.uid + '/last'] = this.user.last;
		userObj[this._currentUser.auth.uid + '/title'] = this.user.title;
		userObj[this._currentUser.auth.uid + '/unit'] = this.user.unit;
		userObj[this._currentUser.auth.uid + '/practice'] = this.user.practice;

		userRef.update(userObj, (error) => {
			if (error) {
				alert("Error: " + error);
			} else {
				alert("Data saved successfully.");
			}
		});

		this.editable = !this.editable;
	}

	clickCancel() {
		this.user = $.extend(true, {}, this.userCopy);
		this.editable = !this.editable;
	}
}