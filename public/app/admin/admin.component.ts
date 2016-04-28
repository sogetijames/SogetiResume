import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {FirebaseRef, CurrentUser, FirebaseData} from '../shared/shared';
import {ValuesPipe} from '../shared/pipe'

@Component({
	selector: 'admin',
	templateUrl: '../../views/admin.component.html',
	viewBindings: [
		FirebaseData
	],
	providers: [
		ValuesPipe
	]
})
export class AdminComponent implements OnInit { 
	users: any;

	ngOnInit() {
		if (!this._currentUser.info.admin) {
			window.history.back();
		}

		this._firebaseData.getDataOnce('users').then((usersSnapshot) => {
			this.users = this._valuesPipe.transform(usersSnapshot.val());
		});
	}

	constructor(
		private _router: Router,
		private _currentUser: CurrentUser,
		private _firebaseData: FirebaseData,
		private _valuesPipe: ValuesPipe
	) {}
}