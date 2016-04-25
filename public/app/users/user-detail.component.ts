import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';
import {CurrentUser, FirebaseRef, Constants} from '../shared/shared';
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
		private _constants: Constants
	) {
		this.editable = false;

		this.sortSkillsNameAZ = true;
		this.sortSkillsProficiencyAZ = true;
		this.showSkillNameArrow = true;
		this.showSkillProficiencyArrow = false;

		let username = this._routeParams.get('username');
		this._userService.getUserByUsername(username.replace('_', '.')).then( user => {
			this.uid = Object.keys(user.val())[0];

			this.user = this._valuesPipe.transform(user.val())[0];
			this.user.profileImageURL = this.user.profileImageURL + "?s=250";

			this._userService.getSkills(this.uid).then( skills => {
				this.user.skills = [];

				let skillsObj = skills.val();
				Object.keys(skillsObj).forEach((key) => {
					this.user.skills.push({
						key: key,
						value: skillsObj[key]
					});
				});

				this.userCopy = $.extend(true, {}, this.user);
			});
		});
	} 

	clickEdit() {
		this.editable = !this.editable;
	}

	clickSave() {
		this.saveUserInfo();
		this.saveUserSkills();
		this.userCopy = $.extend(true, {}, this.user);
		this.editable = !this.editable;
	}

	private saveUserInfo() {
		let userRef = FirebaseRef.child('users');
		let userObj = {};

		userObj[this._currentUser.auth.uid + '/bio'] = this.user.bio;
		userObj[this._currentUser.auth.uid + '/first'] = this.user.first;
		userObj[this._currentUser.auth.uid + '/last'] = this.user.last;
		userObj[this._currentUser.auth.uid + '/title'] = this.user.title;
		userObj[this._currentUser.auth.uid + '/unit'] = this.user.unit;
		userObj[this._currentUser.auth.uid + '/practice'] = this.user.practice;
		userObj[this._currentUser.auth.uid + '/status/text'] = this.user.status.text;
		if (this.user.status.text == 'ATO') {
			this.user.status.description = '';
		} 
		userObj[this._currentUser.auth.uid + '/status/description'] = this.user.status.description;

		userRef.update(userObj, (error) => {
			if (error) {
				console.error(error);
			} else {
				console.log("User Info saved successfully.");
			}
		});
	}

	private saveUserSkills() {
		let skillsRef = FirebaseRef.child('skills').child(this._currentUser.auth.uid);
		let usrSkills = this.user.skills;
		let skillsObj = {};

		for (var i = 0; i < usrSkills.length; i++) {
			skillsObj[usrSkills[i].key] = usrSkills[i].value;
		}

		skillsRef.set(skillsObj, (error) => {
			if (error) {
				console.error(error);
			} else {
				console.log("User Skills saved successfully.");
			}
		});
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

	dynamicSort(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}
}			