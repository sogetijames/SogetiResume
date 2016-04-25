import {Component,Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Constants, FirebaseData} from '../shared/shared';
import {ValuesPipe, SearchPipe, FilterPipe} from '../shared/pipe';

@Component({
	selector: 'search',
	templateUrl: "../../views/user-search.component.html",
	providers: [ 
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
	searchResults: any[];
	searchText: string;
	selectedStatus: any;
	selectedTitle: any;
	selectedPractice: any;
	selectedUnit: any;

	constructor(
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe,
		private _constants: Constants,
		private _firebaseData: FirebaseData
	) { 
		this.searchText = '';
		this.selectedStatus = 'Any';
		this.selectedTitle = 'Any';
		this.selectedPractice = 'Any';
		this.selectedUnit = 'Any';

		this.searchResults = this._valuesPipe.transform(this._firebaseData.users);
	}

	searchUsers(event: any) {
		if (this.searchText != '') {
			this.searchResults = this._searchPipe.transform(this._firebaseData.users, [this._firebaseData.skills, this.searchText]);
		} else {
			this.searchResults = this._valuesPipe.transform(this._firebaseData.users);
		}
	}
}