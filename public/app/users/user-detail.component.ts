import {Component, OnInit} from 'angular2/core';
import {NgClass, DatePipe} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';
import {CurrentUser, FirebaseRef, FirebaseData} from '../shared/shared';
import {ValuesPipe} from '../shared/pipe';
import {UserService} from './user.service';

@Component({
	selector: 'user-detail',
	templateUrl: '../../views/user-detail.component.html',
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

	ngOnInit() {
		this.editable = false;
		this.openSection = 'Bio';

		this.sortSkillsNameAZ = true;
		this.sortSkillsProficiencyAZ = true;
		this.showSkillNameArrow = true;
		this.showSkillProficiencyArrow = false;

		let username = this._routeParams.get('username');
		this._userService.getUserDetails(username, (userObject) => {
			this.user = userObject;
			this.userCopy = $.extend(true, {}, this.user);
		});
	}

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private _routeParams: RouteParams,
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

	toggleSkillOnProject(project, skill) {
		let index = project.skills.indexOf(skill);
		if (index == -1) {
			project.skills.push(skill);
		} else {
			project.skills.splice(index, 1);
		}
	}

	formatDate(dateStr: string) {
		let date = new Date(dateStr);
		return this._datePipe.transform(date, ['mediumDate']);
	}

	private dynamicSort(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return function (a,b) {
	    	var result: any;
	    	if (typeof a[property] === 'string') {
	    		result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;

	    	} else {
	    		result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	    	}
	        return result * sortOrder;
	    }
	}
}			