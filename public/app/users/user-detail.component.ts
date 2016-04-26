import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
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
		ValuesPipe
	]
})
export class UserDetailComponent {
	editable: boolean;
	uid: string;
	user: any;
	userCopy: any;
	sortSkillsNameAZ: boolean;
	sortSkillsProficiencyAZ: boolean;
	showSkillNameArrow: boolean;
	showSkillProficiencyArrow: boolean;

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private _routeParams: RouteParams,
		private _router: Router,
		private _valuesPipe: ValuesPipe,
		private _firebaseData: FirebaseData
	) {
		this.editable = false;

		this.sortSkillsNameAZ = true;
		this.sortSkillsProficiencyAZ = true;
		this.showSkillNameArrow = true;
		this.showSkillProficiencyArrow = false;

		let username = this._routeParams.get('username');
		this._userService.getUserByUsername(username.replace('_', '.')).then( user => {
			let data = user.val();

			this.uid = Object.keys(data)[0];

			this.user = data[this.uid];
			this.user.profileImageURL = this.user.profileImageURL.replace('http://', 'https://') + "?s=250";
			this.user.skills = [];
			this.user.educations = [];

			this.getUserSkills();
			this.getUserEducations();			
		});
	} 

	clickEdit() {
		this.editable = !this.editable;
	}

	clickSave() {
		this.saveUserInfo();
		this.saveUserSkills();
		this.saveUserEducations();

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
			this.user.skills.sort(this.dynamicSort('key'));
		} else {
			this.user.skills.sort(this.dynamicSort('-key'));
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
			this.user.skills.sort(this.dynamicSort('value'));
		} else {
			this.user.skills.sort(this.dynamicSort('-value'));
		}
	}

	private getUserSkills() {
		this._userService.getDataForUidOnce('skills', this.uid).then( skills => {
			let skillsObject = skills.val();

			if (skillsObject != undefined) {
				Object.keys(skillsObject).forEach((key) => {
					this.user.skills.push({
						key: key,
						value: skillsObject[key]
					});
				});				
			}

			this.userCopy = $.extend(true, {}, this.user);
		});
	}

	private getUserEducations() {
		this._userService.getDataForUidOnce('educations', this.uid).then( educations => {
			let educationsObject = educations.val();

			if (educationsObject != undefined){
				Object.keys(educationsObject).forEach((key) => {
					this.user.educations.push({
						title: key,
						description: educationsObject[key]
					});
				});
			}

			this.userCopy = $.extend(true, {}, this.user);		
		});
	}

	private saveUserInfo() {
		let userRef = FirebaseRef.child('users').child(this.uid);
		let userObj = {};

		userObj['bio'] = this.user.bio;
		userObj['first'] = this.user.first;
		userObj['last'] = this.user.last;
		userObj['title'] = this.user.title;
		userObj['unit'] = this.user.unit;
		userObj['practice'] = this.user.practice;
		userObj['status/text'] = this.user.status.text;
		if (this.user.status.text == 'ATO') {
			this.user.status.description = '';
		} 
		userObj['status/description'] = this.user.status.description;

		userRef.update(userObj, (error) => {
			if (error) {
				toastr.error('Error saving Info!', error);
			} else {
				toastr.success('Info Saved Successfully!');
			}
		});
	}

	private saveUserSkills() {
		let skillsObject = {};
		let skillsRef = FirebaseRef.child('skills').child(this.uid);
		let skills = this.user.skills;

		for (var i = 0; i < skills.length; i++) {
			skillsObject[skills[i].key] = skills[i].value;
		}

		skillsRef.set(skillsObject, (error) => {
			if (error) {
				toastr.error('Error saving Skills!', error);
			} else {
				toastr.success('Skills Saved Successfully!');
			}
		});
	}

	private saveUserEducations() {
		let educationObject = {};
		let educationRef = FirebaseRef.child('educations').child(this.uid);
		let educations = this.user.educations;

		for (var i = 0; i < educations.length; i++) {
			educationObject[educations[i].title] = educations[i].description;
		}

		educationRef.set(educationObject, (error) => {
			if (error) {
				toastr.error('Error saving Education!', error);
			} else {
				toastr.success('Education Saved Successfully!');
			}
		});
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