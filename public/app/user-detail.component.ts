import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {CurrentUser} from './currentUser';
import {UserService} from './user.service';
import {ValuesPipe} from './values.pipe';
import {NgClass} from 'angular2/common';

@Component({
	selector: 'user-detail',
	templateUrl: '../views/profile.html',
  directives: [NgClass],
	providers: [ 
		UserService,
		ValuesPipe
	]
})
export class UserDetailComponent {
	editable: boolean;
	proficiencyArr: any[];
	statusArr: any[];
	uid: string;
	user: any;
	userCopy: any;
	aTOz: string;
	profUp: string;

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private _routeParams: RouteParams,
		private _router: Router,
		private _valuesPipe: ValuesPipe
	) {  
		this.aTOz = "up";
		this.profUp = "neutral";
		this.editable = false;
		this.proficiencyArr = ['Fundamental Awareness', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
		this.statusArr = ['ATO', 'Project', 'PTO'];

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

				//set proficiency sort numbers
				for(var i = 0; i < this.user.skills.length; i++) {
					switch (this.user.skills[i].value)
					{
					  case this.proficiencyArr[0] : 
					    this.user.skills[i].valueNumber = 0; 
					    break; 
					  case this.proficiencyArr[1] : 
					    this.user.skills[i].valueNumber = 1; 
					    break; 
			    	case this.proficiencyArr[2] : 
					    this.user.skills[i].valueNumber = 2; 
					    break; 
			    	case this.proficiencyArr[3] : 
					    this.user.skills[i].valueNumber = 3; 
					    break; 
			    	case this.proficiencyArr[4] : 
					    this.user.skills[i].valueNumber = 4; 
					    break; 
					}
				}

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

	sortSkills(sortType: string) {
		let userSkills = this.user.skills;
		if(userSkills.length > 0) {
			var tempSkill = userSkills[0];
			
			if(sortType == "A-Z") {
				this.aTOz = "up";
				this.profUp = "neutral";
				for (var i = userSkills.length - 1; i>=0; i--) {
					for(var j = 1; j<=i; j++) {
						if(userSkills[j-1].key.toLowerCase()>userSkills[j].key.toLowerCase()){
				           var temp = userSkills[j-1];
				           userSkills[j-1] = userSkills[j];
				           userSkills[j] = temp;
				        }
					}
				}
			}
				
			if(sortType == "Z-A"){
				this.aTOz = "down";
				this.profUp = "neutral";
				for (var i = userSkills.length - 1; i>=0; i--) {
					for(var j = 1; j<=i; j++) {
						if(userSkills[j-1].key.toLowerCase()<userSkills[j].key.toLowerCase()){
				           var temp = userSkills[j-1];
				           userSkills[j-1] = userSkills[j];
				           userSkills[j] = temp;
				        }
					}
				}	
			}

			if(sortType == "DOWN"){
				this.aTOz = "neutral";
				this.profUp = "down";
				for (var i = userSkills.length - 1; i>=0; i--) {
					for(var j = 1; j<=i; j++) {
						if(userSkills[j-1].valueNumber<userSkills[j].valueNumber){
				           var temp = userSkills[j-1];
				           userSkills[j-1] = userSkills[j];
				           userSkills[j] = temp;
				        }
					}
				}	
			}

			if(sortType == "UP") {
				this.aTOz = "neutral";
				this.profUp = "up";
				for (var i = userSkills.length - 1; i>=0; i--) {
					for(var j = 1; j<=i; j++) {
						if(userSkills[j-1].valueNumber>userSkills[j].valueNumber){
				           var temp = userSkills[j-1];
				           userSkills[j-1] = userSkills[j];
				           userSkills[j] = temp;
				        }
					}
				}
			}



		}
		
	  	
	}
}			