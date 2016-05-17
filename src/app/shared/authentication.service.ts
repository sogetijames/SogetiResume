import { Injectable, Inject } from '@angular/core';

import { FirebaseRef } from './shared';

@Injectable()
export class AuthenticationService {
	
	public createUser(email: string, password: string, callback: any) {
		return FirebaseRef.createUser({
			email: email,
			password: password
		}, (error: any, authData: FirebaseAuthData) => {
			callback(error, authData);
		});
	}

	public changePassword(email: string, oldPassword: string, newPassword: string, callback: any) {
		FirebaseRef.changePassword({
			email       : email,
  			oldPassword : oldPassword,
  			newPassword : newPassword
  		}, (error: any) => { 
  			callback(error);
  		});
	}

	public login(email: string, password: string) {
		return FirebaseRef.authWithPassword({
			email: email,
			password: password
		});
	}

	public logout() {
		FirebaseRef.unauth();
	}
}