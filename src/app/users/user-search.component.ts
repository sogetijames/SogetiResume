import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { FirebaseData } from '../shared/shared';
import { ValuesPipe, SearchPipe, FilterPipe } from '../shared/pipe';

@Component({
	selector: 'search',
	templateUrl: "./app/users/user-search.component.html",
	providers: [ 
		ValuesPipe,
		SearchPipe
	],
	directives: [
		ROUTER_DIRECTIVES
	],
	pipes: [
		FilterPipe
	],
	viewBindings: [
		FirebaseData
	]
})
export class SearchComponent implements OnInit {
	firebaseUsers: any;
	firebaseSkills: any;
	searchResults: any[];
	searchText: string;
	selectedStatus: any;
	selectedTitle: any;
	selectedPractice: any;
	selectedUnit: any;
	showFilterRow: boolean;

	ngOnInit() {
		this.searchText = '';
		this.selectedStatus = '';
		this.selectedTitle = '';
		this.selectedPractice = '';
		this.selectedUnit = '';
		this.showFilterRow = false;	
		this.searchResults = [];
	}

	constructor(
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe,
		private _firebaseData: FirebaseData 
	) { 
		this._firebaseData.getDataOnce('users').then((usersSnapshot) => {
			let users = usersSnapshot.val();

			Object.keys(users).forEach((key) => {
				if (!users[key].active) {
					delete users[key];
				}
			});

			this.firebaseUsers = users;
			this.searchResults = this._valuesPipe.transform(this.firebaseUsers);
		});

		this._firebaseData.getDataOnce('skills').then((skillsSnapshot) => {
			this.firebaseSkills = skillsSnapshot.val();
		});
	}

	resetFilters() {
		this.searchText = '';
		this.selectedStatus = '';
		this.selectedTitle = '';
		this.selectedPractice = '';
		this.selectedUnit = '';

		this.searchResults = this._valuesPipe.transform(this.firebaseUsers);
	}

	searchUsers(event: any) {
		if (this.searchText != '') {
			this.searchResults = this._searchPipe.transform(this.firebaseUsers, [this.firebaseSkills, this.searchText]);
		} else {
			this.searchResults = this._valuesPipe.transform(this.firebaseUsers);
		}
	}
}