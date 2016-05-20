import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { 
	FirebaseData,
	ObjectToArrayPipe,
	ResumeFilterPipe,
	ResumeSearchPipe
} from '../';

@Component({
	selector: 'resumes',
	templateUrl: "./app/+resumes/resumes.component.html",
	providers: [ 
		ObjectToArrayPipe,
		ResumeSearchPipe
	],
	directives: [
		ROUTER_DIRECTIVES
	],
	pipes: [
		ResumeFilterPipe
	],
	viewBindings: [
		FirebaseData
	]
})
export class ResumesComponent implements OnInit {
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
		private objectToArrayPipe: ObjectToArrayPipe,
		private resumeSearchPipe: ResumeSearchPipe,
		private firebaseData: FirebaseData 
	) { 
		this.firebaseData.getDataOnce('resumes').then((usersSnapshot: any) => {
			let users = usersSnapshot.val();

			if (users != null) {
				Object.keys(users).forEach((key) => {
					if (!users[key].active) {
						delete users[key];
					}
				});
			}			

			this.firebaseUsers = users;
			this.searchResults = this.objectToArrayPipe.transform(this.firebaseUsers);
		});

		this.firebaseData.getDataOnce('skills').then((skillsSnapshot: any) => {
			this.firebaseSkills = skillsSnapshot.val();
		});
	}

	resetFilters() {
		this.searchText = '';
		this.selectedStatus = '';
		this.selectedTitle = '';
		this.selectedPractice = '';
		this.selectedUnit = '';

		this.searchResults = this.objectToArrayPipe.transform(this.firebaseUsers);
	}

	searchUsers(event: any) {
		if (this.searchText != '') {
			this.searchResults = this.resumeSearchPipe.transform(this.firebaseUsers, [this.firebaseSkills, this.searchText]);
		} else {
			this.searchResults = this.objectToArrayPipe.transform(this.firebaseUsers);
		}
	}
}