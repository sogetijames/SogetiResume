import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {FirebaseRef, CurrentUser, FirebaseData, dynamicSort} from '../shared/shared';
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
	editable: boolean;
	newConstants: any;
	dynamicSort: any;
	sortUsersBy: string;

	ngOnInit() {
		if (!this._currentUser.info.admin) {
			window.history.back();
		}

		this._firebaseData.getDataOnce('users').then((usersSnapshot) => {
			this.users = this._valuesPipe.transform(usersSnapshot.val());
		});

		this.editable = false;
		this.newConstants = {};
		this.sortUsersBy = 'first';
		this.dynamicSort = dynamicSort;
	}

	constructor(
		private _router: Router,
		private _currentUser: CurrentUser,
		private _firebaseData: FirebaseData,
		private _valuesPipe: ValuesPipe
	) {}

	clickEdit() {
		this.newConstants.practices = this._firebaseData.practices.slice(0);
		this.newConstants.proficiency = this._firebaseData.proficiency.slice(0);
		this.newConstants.statuses = this._firebaseData.statuses.slice(0);
		this.newConstants.titles = this._firebaseData.titles.slice(0);
		this.newConstants.units = this._firebaseData.units.slice(0);
		this.editable = true;
	}

	clickCancel() {
		this.editable = false;
	}

	clickSave() {
		FirebaseRef.child('constants').set(this.newConstants, error => {
			if (error) {
				toastr.error(error);
			} else {
				toastr.success('Constants Saved Successfully!');
			}
		});

		this.editable = false;
	}

	clickSortUsersBy(newSortByString: string) {
		if (this.sortUsersBy == newSortByString) {
			this.sortUsersBy = '-' + newSortByString;
		} else {
			this.sortUsersBy = newSortByString;
		}
	}

	toggleUserStatus(userIndex: number, userStatus: string) {
		let user = this.users[userIndex];
		let fullname = user.first + ' ' + user.last;
		let updateObject = {};
		updateObject[userStatus] = !user[userStatus];

		FirebaseRef.child('users').child(user.uid).update(updateObject, error => {
			if (error) {
				toastr.error('Error changing ' + userStatus + ' status for ' + fullname);
			}
		})
	}
}