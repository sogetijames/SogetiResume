import { Injectable } from '@angular/core';

import { FIREBASE_REF } from '../../shared';

@Injectable()
export class ResumesService {
	private infoEditablePropertiesArray: string[];

	constructor() { 
		this.infoEditablePropertiesArray = ['bio', 'first', 'last', 'title', 'unit', 'practice', 'status'];
	}

	public getUserByUid(uid: string) {
		return FIREBASE_REF.child('users').child(uid).once('value');
	}

	public getDataForUidOnce(child: string, uid: string) {
		return FIREBASE_REF.child(child).child(uid).once('value');
	}

	public getUserDetails(username: string, callback: Function) {
		this.getUserByUsername(username).then((user) => {
			let data = user.val();

			let uid = Object.keys(data)[0];
			let userObject = data[uid];

			userObject.uid = uid;
			userObject.profileImageURL = userObject.profileImageURL.replace('http://', 'https://') + "?s=256";
			userObject.educations = [];
			userObject.projects = [];
			userObject.skills = [];

			let educationsPromise = this.getDataForUidOnce('educations', uid);
			let projectsPromise = this.getDataForUidOnce('projects', uid);
			let skillsPromise = this.getDataForUidOnce('skills', uid);

			Promise.all([educationsPromise, projectsPromise, skillsPromise]).then((dataSnapshot) => {
				let educationSnapshot: any = dataSnapshot[0]; 
				let educationsObject = educationSnapshot.val();
				if (educationsObject != undefined) {
					userObject.educations = educationsObject;
				}

				let projectsSnapshot: any = dataSnapshot[1];
				let projectsObject = projectsSnapshot.val();
				if (projectsObject != undefined) {
					userObject.projects = projectsObject;
				}

				let skillsSnapshot: any = dataSnapshot[2];
				let skillsObject = skillsSnapshot.val();
				if (skillsObject != undefined) {
					userObject.skills = skillsObject;
				}

				callback(userObject);
			});
		});
	}

	public saveUserEducations(uid: string, educations: any) {
		FIREBASE_REF.child('educations').child(uid).set(educations, error => this.showAlert(error, 'Education') );
	}

	public saveUserProjects(uid: string, projects: any) {
		FIREBASE_REF.child('projects').child(uid).set(projects, error => this.showAlert(error, 'Projects') );
	}

	public saveUserSkills(uid: string, skills: any) {
		FIREBASE_REF.child('skills').child(uid).set(skills, error => this.showAlert(error, 'Skills') );
	}

	public saveUserInfo(uid: string, info: any) {
		let infoObject = {};
		this.infoEditablePropertiesArray.forEach( property => infoObject[property] = info[property] );
		FIREBASE_REF.child('users').child(uid).update(infoObject, error => this.showAlert(error, 'Profile') );
	}

	private showAlert(error: any, property: string) {
		if (error) {
			toastr.error('Error Saving ' + property + '!', error);
		} else {
			toastr.success(property + ' Saved Successfully!');
		}
	}
	
	private getUserByUsername(username: string) {
		let email = username.toLowerCase().replace('_', '.') + '@us.sogeti.com';
		return FIREBASE_REF.child('users').orderByChild('email').startAt(email).endAt(email + '\uf8ff').once('value');
	}
}