import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {FirebaseData} from '../shared/shared';
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
	],
	viewBindings: [
		FirebaseData
	]
})
export class SearchComponent implements OnInit {
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
	}

	constructor(
		private _valuesPipe: ValuesPipe,
		private _searchPipe: SearchPipe,
		private _firebaseData: FirebaseData 
	) { 
		this.searchResults = this._valuesPipe.transform(this._firebaseData.users);			
	}

	resetFilters() {
		this.searchText = '';
		this.selectedStatus = '';
		this.selectedTitle = '';
		this.selectedPractice = '';
		this.selectedUnit = '';

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