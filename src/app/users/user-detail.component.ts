import { Component, OnInit } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { Router, RouteSegment } from '@angular/router';

import { CurrentUser, FirebaseRef, FirebaseData, dynamicSort } from '../shared/shared';
import { ValuesPipe } from '../shared/pipe';
import { UserService } from './user.service';

@Component({
	selector: 'user-detail',
	templateUrl: './app/users/user-detail.component.html',
	directives: [
		NgClass
	],
	providers: [ 
		UserService,
		ValuesPipe,
		DatePipe
	]
})
export class UserDetailComponent implements OnInit {
	editable: boolean;
	user: any;
	userCopy: any;
	sortSkillsNameAZ: boolean;
	sortSkillsProficiencyAZ: boolean;
	showSkillNameArrow: boolean;
	showSkillProficiencyArrow: boolean;
	openSection: string;
	dynamicSort: any;

	ngOnInit() {
		this.editable = false;
		this.openSection = 'Bio';

		this.sortSkillsNameAZ = true;
		this.sortSkillsProficiencyAZ = true;
		this.showSkillNameArrow = true;
		this.showSkillProficiencyArrow = false;

		let username = this.routeSegment.getParam('username');
		this._userService.getUserDetails(username, (userObject: any) => {
			this.user = userObject;
			this.userCopy = $.extend(true, {}, this.user);
		});

		this.dynamicSort = dynamicSort;
	}

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private routeSegment: RouteSegment,
		private _router: Router,
		private _valuesPipe: ValuesPipe,
		private _firebaseData: FirebaseData,
		private _datePipe: DatePipe) { } 

	clickEdit() {
		this.editable = !this.editable;
	}

	clickSave() {
		this._userService.saveUserEducations(this.user.uid, this.user.educations);
		this._userService.saveUserProjects(this.user.uid, this.user.projects);
		this._userService.saveUserSkills(this.user.uid, this.user.skills);
		this._userService.saveUserInfo(this.user.uid, this.user);

		this.userCopy = $.extend(true, {}, this.user);
		this.editable = !this.editable;

		this.sortSkillsNameAZ = true;
		this.showSkillNameArrow = true;
		this.showSkillProficiencyArrow = false;
		this.user.skills.sort(this.dynamicSort('key'));
	}

	clickCancel() {
		this.user = $.extend(true, {}, this.userCopy);
		this.editable = !this.editable;
	}

	toggleSortSkillsByName() {
		if (this.showSkillProficiencyArrow) {
			this.sortSkillsNameAZ = true; 
		} else {
			this.sortSkillsNameAZ = !this.sortSkillsNameAZ; 
		}

		this.showSkillNameArrow = true;
		this.showSkillProficiencyArrow = false;

		if (this.sortSkillsNameAZ) {
			this.user.skills.sort(this.dynamicSort('name'));
		} else {
			this.user.skills.sort(this.dynamicSort('-name'));
		}
	}

	toggleSortSkillsByProficiency() {
		if (this.showSkillNameArrow) {
			this.sortSkillsProficiencyAZ = true; 
		} else {
			this.sortSkillsProficiencyAZ = !this.sortSkillsProficiencyAZ; 
		}

		this.showSkillNameArrow = false;
		this.showSkillProficiencyArrow = true;		

		if (this.sortSkillsProficiencyAZ) {
			this.user.skills.sort(this.dynamicSort('proficiency'));
		} else {
			this.user.skills.sort(this.dynamicSort('-proficiency'));
		}
	}

	toggleSkillOnProject(project: any, skill: string) {
		let index = project.skills.indexOf(skill);
		if (index == -1) {
			project.skills.push(skill);
		} else {
			project.skills.splice(index, 1);
		}
	}

	formatDate(dateStr: string) {
		let date = new Date(dateStr);
		return this._datePipe.transform(date, 'mediumDate');
	}
}