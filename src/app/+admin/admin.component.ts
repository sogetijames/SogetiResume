import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FIREBASE_REF, CurrentUser, FirebaseData, dynamicSort, ObjectToArrayPipe } from '../shared';

@Component({
	selector: 'admin',
	templateUrl: './app/+admin/admin.component.html',
	viewBindings: [
		FirebaseData
	],
	providers: [
		ObjectToArrayPipe
	]
})
export class AdminComponent implements OnInit { 
	users: any;
	editable: boolean;
	newConstants: any;
	dynamicSort: any;
	sortUsersBy: string;

	ngOnInit() {
		if (!this.currentUser.info.admin) {
			window.history.back();
		}

		this.firebaseData.getDataOnce('users').then((usersSnapshot) => {
			this.users = this.objectToArrayPipe.transform(usersSnapshot.val());
		});

		this.editable = false;
		this.newConstants = {};
		this.sortUsersBy = 'first';
		this.dynamicSort = dynamicSort;
	}

	constructor(
		private router: Router,
		private currentUser: CurrentUser,
		private firebaseData: FirebaseData,
		private objectToArrayPipe: ObjectToArrayPipe
	) {}

	clickEdit() {
		this.newConstants.practices = this.firebaseData.practices.slice(0);
		this.newConstants.proficiency = this.firebaseData.proficiency.slice(0);
		this.newConstants.statuses = this.firebaseData.statuses.slice(0);
		this.newConstants.titles = this.firebaseData.titles.slice(0);
		this.newConstants.units = this.firebaseData.units.slice(0);
		this.editable = true;
	}

	clickCancel() {
		this.editable = false;
	}

	clickSave() {
		FIREBASE_REF.child('constants').set(this.newConstants, error => {
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

	swapArrayElements(array: any[], indexA: number, indexB: number) {
		let temp = array[indexA];
		array[indexA] = array[indexB];
		array[indexB] = temp;
	}

	toggleUserStatus(userIndex: number, userStatus: string) {
		let user = this.users[userIndex];
		let fullname = user.first + ' ' + user.last;
		let updateObject = {};
		updateObject[userStatus] = !user[userStatus];

		FIREBASE_REF.child('users').child(user.uid).update(updateObject, error => {
			if (error) {
				toastr.error('Error changing ' + userStatus + ' status for ' + fullname);
			}
		})
	}
}