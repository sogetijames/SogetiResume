import {Component,Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CurrentUser, Constants, FirebaseRef} from '../shared/shared';
import {ValuesPipe, SearchPipe, FilterPipe} from '../shared/pipe';
import {UserService} from './user.service';

@Component({
	selector: 'search',
	templateUrl: "../../views/user-search.component.html",
	providers: [ 
		UserService,
		ValuesPipe,
		SearchPipe
	],
	directives: [
		ROUTER_DIRECTIVES
	],
	pipes: [
		FilterPipe
	]
})
export class SearchComponent {
	usersObject: any;
	skillsObject: any;
	searchResults: any[];
	filteredResults: any[];
	searchText: string;
	selectedStatus: any;
	selectedTitle: any;
	selectedPractice: any;
	selectedUnit: any;

	constructor(
		private _userService: UserService,
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe,
		private _constants: Constants
	) { 
		this.searchText = '';
		this.selectedStatus = 'Any';
		this.selectedTitle = 'Any';
		this.selectedPractice = 'Any';
		this.selectedUnit = 'Any';
		this.searchResults = [];
		this.filteredResults = [];

		FirebaseRef.on('value', (dataSnapshot) => {
			let data = dataSnapshot.val();

			Object.keys(data.users).forEach((key) => {
				if (!data.users[key].active) {
					delete data.users[key];
				}
			});

			this.usersObject = data.users;
			this.skillsObject = data.skills;
			this.searchUsers(null);
		});
	}

	searchUsers(event: any) {
		if (this.searchText != '') {
			this.searchResults = this._searchPipe.transform(this.usersObject, [this.skillsObject, this.searchText]);
		} else {
			this.searchResults = this._valuesPipe.transform(this.usersObject);
		}
	}
}