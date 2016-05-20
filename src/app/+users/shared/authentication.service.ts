import { Injectable, Inject } from '@angular/core';

import { FIREBASE_AUTH, FIREBASE_REF } from '../../shared';

@Injectable()
export class AuthenticationService {

    public sendPasswordResetEmail(email: string, callback: any) {
        FIREBASE_AUTH.sendPasswordResetEmail(email).then(
            () => callback(),
            (error: any) => callback(error)
        );
    }

    public confirmPasswordReset(code: string, newPassword: string, callback: any) {
        FIREBASE_AUTH.confirmPasswordReset(code, newPassword).then(
            () => callback(),
            (error: any) => callback(error)
        );
    }

    public checkIfUsernameExists(username: string, callback: any) {
        FIREBASE_REF.child('resumes').orderByChild('username').startAt(username).endAt(username).once('value', (dataSnapshot: any) => {
            let exists = false;
            let data = dataSnapshot.val();
            if (data != null) {
                exists = true;
            } 
            callback(exists);
        });
    }
    
    public createUser(userDetails: any, callback: any) {
        FIREBASE_AUTH.createUserWithEmailAndPassword(userDetails.email, userDetails.password).then(
            (user: any) => this.createUserResume(user.uid, userDetails, callback),
            (error: any) => callback(error)
        )
    }

    public signIn(email: string, password: string, callback: any) {
        FIREBASE_AUTH.signInWithEmailAndPassword(email, password).then(
            (user: any) => callback(),
            (error: any) => callback(error)
        );
    }

    public signOut() {
        FIREBASE_AUTH.signOut();
    }

    private createUserResume(uid: string, userDetails: any, callback: any) {
        this.signIn(userDetails.email, userDetails.password, (error: any) => {
            if (error) {
                callback(error);
            } else {
                FIREBASE_REF.child('resumes').child(uid).set({
                    active: true,
                    admin: false,
                    bio: '',
                    email: userDetails.email,
                    first: userDetails.first,
                    last: userDetails.last,
                    practice: userDetails.practice,
                    // profileImageURL: authData.password.profileImageURL.replace("?d=retro","?s=256").replace('http://', 'https://'),
                    status: {
                        description: '',
                        text: ''
                    },
                    title: userDetails.title,
                    unit: userDetails.unit,
                    username: userDetails.username
                });
            }
        });
    }
}