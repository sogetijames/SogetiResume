import {Component,Input} from 'angular2/core';
import {ValuesPipe} from './values.pipe';
import {UserService} from './user.service';


@Component({
	selector: 'search',
	templateUrl: "../views/search.html",
	pipes: [
		ValuesPipe
	]
})

export class searchComponent {

	searchResults: Object;
	searchText: String;
	
	constructor(private _userService: UserService) { }

	searchUsersByName(event: any) {
		var first: Object;
		var last: Object;
		var searchText = (<HTMLInputElement>event.target).value;
		console.log(searchText);
		this._userService.searchUsersByFullName(searchText).then(
			firstname => {
				first = firstname.val();
				this._userService.searchUsersByLastName(searchText).then( 
					lastname => {
						last = lastname.val();
						this.searchResults = $.extend({}, first, last);
					}
				);
			}
			
		);
		
	}
}