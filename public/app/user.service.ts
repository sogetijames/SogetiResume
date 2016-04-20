import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef, FirebaseRefUsers} from './firebase-ref';

@Injectable()
export class UserService {
	constructor() { }

	public getUser(uid: string) {
		return FirebaseRef.child('/users').child(uid).once("value");
	}
	
	public getUserByUsername(username: string) {
		let email = username + '@us.sogeti.com';
		return FirebaseRef.child('/users').orderByChild('email').startAt(email).endAt(email + "\uf8ff").once("value");
	}
	
	public searchUsersByFullName(name: string){
		name = name.toLowerCase();
		var firstnameSearch = FirebaseRefUsers.orderByChild("fullname").startAt(name).endAt(name + "\uf8ff").once("value");
		return  firstnameSearch;
	}

	public searchUsersByLastName(name: string){
		name = name.toLowerCase();
		var lastnameSearch = FirebaseRefUsers.orderByChild("last").startAt(name).endAt( name+ "\uf8ff").once("value") ;
		return  lastnameSearch;
	}

	public searchBioByUID(uid: string){
		return FirebaseRef.child('/bio').child(uid).once("value");
	}
}