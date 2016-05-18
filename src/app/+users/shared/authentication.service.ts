import { Injectable, Inject } from '@angular/core';

import { FIREBASE_REF } from '../../shared';

@Injectable()
export class AuthenticationService {
	
	public createUser(email: string, password: string, callback: any) {
		return FIREBASE_REF.createUser({
			email: email,
			password: password
		}, (error: any, authData: FirebaseAuthData) => {
			callback(error, authData);
		});
	}

	public changePassword(email: string, oldPassword: string, newPassword: string, callback: any) {
		FIREBASE_REF.changePassword({
				email       : email,
  			oldPassword : oldPassword,
  			newPassword : newPassword
  		}, (error: any) => { 
  			callback(error);
  		});
	}

	public login(email: string, password: string) {
		return FIREBASE_REF.authWithPassword({
			email: email,
			password: password
		});
	}

	public logout() {
		FIREBASE_REF.unauth();
	}
}