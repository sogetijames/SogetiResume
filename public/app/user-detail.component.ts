import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {FirebaseRef} from './firebase-ref';
import {CurrentUser} from './currentUser';
import {UserService} from './user.service';
import {ValuesPipe} from './values.pipe';
import {NgClass} from 'angular2/common';

@Component({
	selector: 'user-detail',
	templateUrl: '../views/profile.html',
  	styles: [`
    	.red-profile {
	      	border: 5px solid #b30000;
    	}
	    .yellow-profile {
	      	border: 5px solid Yellow;
	   	}
	    .green-profile {
	      	border: 5px solid #008000;
    	}
  	`],
  directives: [NgClass],
	providers: [ 
		UserService,
		ValuesPipe
	]
})
export class UserDetailComponent implements OnInit {
	editable: boolean;
	proficiencyArr: any[];
	statusArr: any[];
	uid: string;
	user: any;
	userCopy: any;

	constructor(
		private _currentUser: CurrentUser,
		private _userService: UserService, 
		private _routeParams: RouteParams,
		private _router: Router,
		private _valuesPipe: ValuesPipe
	) {  
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

				this.userCopy = $.extend(true, {}, this.user);
			});
		});
	} 

	ngOnInit() {
		if (!FirebaseRef.getAuth()) {
			this._router.navigate(['Login']);
		}
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
}