import { Injectable, Inject } from '@angular/core';

import { FIREBASE_REF } from '../../shared';

@Injectable()
export class AuthenticationService {

    public changePassword(email: string, oldPassword: string, newPassword: string, callback: any) {
        FIREBASE_REF.changePassword({
            email       : email,
            oldPassword : oldPassword,
            newPassword : newPassword
        }, (error: any) => { 
            callback(error);
        });
    }

    public checkIfUsernameExists(username: string, callback: any) {
        FIREBASE_REF.child('users').orderByChild('username').startAt(username).endAt(username).once('value', (dataSnapshot) => {
            let exists = false;
            let data = dataSnapshot.val();
            if (data != null) {
                exists = true;
            } 
            callback(exists);
        });
    }
    
    public createUser(userDetails: any, callback: any) {
        FIREBASE_REF.createUser({ 
            email: userDetails.email, 
            password: userDetails.password 
        }, 
        (error: any, authData: FirebaseAuthData) => {
            if (error) {
                callback(error);
            } else {
                this.createUserResume(authData.uid, userDetails, callback);
            }
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

    public resetPassword(email: string, callback: any) {
        FIREBASE_REF.resetPassword({email: email}, (error) => {
            if (error) {
                switch (error.code) {
                    case "INVALID_USER":
                        toastr.error('The specified user account does not exist.');
                        break;                        
                    default:
                        toastr.error(error);
                        break;
                }
            } else {
                toastr.info('Password reset email sent successfully!');
            }
            callback(error);
        });
    }

    private createUserResume(uid: string, userDetails: any, callback: any) {
        this.login(userDetails.email, userDetails.password).then((authData: FirebaseAuthData) => {
            if (authData != null) {
                FIREBASE_REF.child('users').child(uid).update({
                    active: true,
                    admin: false,
                    bio: '',
                    email: userDetails.email,
                    first: userDetails.first,
                    last: userDetails.last,
                    practice: userDetails.practice,
                    profileImageURL: authData.password.profileImageURL.replace("?d=retro","?s=256").replace('http://', 'https://'),
                    status: {
                        description: '',
                        text: ''
                    },
                    title: userDetails.title,
                    unit: userDetails.unit,
                    username: userDetails.username
                }, (error) => {
                    callback(error);
                });
            }
        }, (error: any) => {
            callback(error);
        });
    }
}