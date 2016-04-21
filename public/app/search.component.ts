import {Component,Input} from 'angular2/core';
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
	]
})
export class SearchComponent {
	allUsers: any;
	searchResults: any;
	searchText: string;

	constructor(
		private _userService: UserService,
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe
	) { 
		FirebaseRef.child('users').orderByChild('email').on('value', (users) => {
			this.allUsers = this._valuesPipe.transform(users.val());
		});

		this.searchText = '';
		this.searchResults = [];
	}

	searchUsersByName(event: any) {
		if (this.searchText != '') {
			this.searchResults = this._searchPipe.transform(this.allUsers, [this.searchText]);
		} else {
			this.searchResults = [];
		}
	}
}