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
	user: any;
	userCopy: Object;

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
			this.user = this._valuesPipe.transform(user.val())[0];
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

		userObj[this._currentUser.auth.uid + '/first'] = this.user.first;
		userObj[this._currentUser.auth.uid + '/last'] = this.user.last;
		userObj[this._currentUser.auth.uid + '/fullname'] = this.user.fullname;
		userObj[this._currentUser.auth.uid + '/title'] = this.user.title;
		userObj[this._currentUser.auth.uid + '/unit'] = this.user.unit;

		userRef.update(userObj, (error) => {
			if (error) {
				this._router.navigate(['Profile', { username: this.user.email.split('@')[0].replace('.', '_') }]);
			} else {
				alert("Data saved successfully.");
				this.editable = !this.editable;
			}
		});
	}

	clickCancel() {
		this.user = $.extend(true, {}, this.userCopy);
		this.editable = !this.editable;
	}
}