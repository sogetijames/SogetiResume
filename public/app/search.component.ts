import {Component,Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {ValuesPipe, SearchPipe} from './values.pipe';
import {UserService} from './user.service';

@Component({
	selector: 'search',
	templateUrl: "../views/search.html",
	providers: [ 
		UserService,
		ValuesPipe,
		SearchPipe
	],
	directives: [
		ROUTER_DIRECTIVES
	]
})
export class SearchComponent {
	usersObject: any;
	skillsObject: any;
	searchResults: any;
	searchText: string;

	constructor(
		private _userService: UserService,
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe,
	) { 
		this.searchText = '';
		this.searchResults = [];

		FirebaseRef.child('users').orderByChild('active').equalTo(true).on('value', (users) => {
			this.usersObject = users.val();
		});

		FirebaseRef.child('skills').on('value', (skills) => {
			this.skillsObject = skills.val();
		});
	}

	searchUsers(event: any) {
		if (this.searchText != '') {
			this.searchResults = this._searchPipe.transform(this.usersObject, [this.skillsObject, this.searchText]);
		}
	}
}