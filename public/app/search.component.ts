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
	allUsers: any;
	searchResults: any;
	searchText: string;

	constructor(
		private _userService: UserService,
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe
	) { 
		this.searchText = '';
		this.searchResults = [];

		FirebaseRef.child('users').orderByChild('email').on('value', (users) => {
			this.allUsers = this._valuesPipe.transform(users.val());
			this.searchUsers(null);
		});
	}

	searchUsers(event: any) {
		this.searchResults = this._searchPipe.transform(this.allUsers, [this.searchText]);
	}
}