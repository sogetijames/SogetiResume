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
		var usersRef = FirebaseRef.child("users").child(this._currentUser.auth.uid);
		var obj = {};

		usersRef.update({
		  first:this._currentUser.info.first
		  }, (error) => {
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