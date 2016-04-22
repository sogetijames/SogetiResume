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
		private _searchPipe: SearchPipe
	) { 
		this.searchText = '';
		this.searchResults = [];

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