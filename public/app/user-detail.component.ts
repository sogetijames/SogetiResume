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
	editable: boolean;
	constructor(
		private _currentUser: CurrentUser,
		private _router: Router
	) {  
		this.editable = false;
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
		this._currentUser.info.fullname = this._currentUser.info.first + " " + this._currentUser.info.last; 
		var usersRef = FirebaseRef.child("users");
		var infoObj = {};
		infoObj[this._currentUser.auth.uid + '/first'] = this._currentUser.info.first;
		infoObj[this._currentUser.auth.uid + '/last'] = this._currentUser.info.last;
		infoObj[this._currentUser.auth.uid + '/fullname'] = this._currentUser.info.fullname;
		infoObj[this._currentUser.auth.uid + '/title'] = this._currentUser.info.title;
		infoObj[this._currentUser.auth.uid + '/unit'] = this._currentUser.info.unit;

		usersRef.update(
		  infoObj
		, (error) => {
		  if (error) {
		    alert("Data could not be saved." + error);
		  } else {
		    alert("Data saved successfully.");
		  }
		});
		this.editable = !this.editable;
	}

	clickCancel() {
		this.editable = !this.editable;
	}
}