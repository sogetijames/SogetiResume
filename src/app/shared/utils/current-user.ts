import { Injectable } from '@angular/core';

import { FIREBASE_REF } from './'

@Injectable()
export class CurrentUser {
    public auth: any = {};
    public info: any = {};

    public resetCurrentUser() {
        this.auth = {};
        this.info = {};
    }

    public setCurrentUser(user: any) {
        if (user != null) {
            this.auth = user;

            FIREBASE_REF.child('resumes').child(user.uid).on('value', (info: any) => {
                this.info = info.val();
            });
        }
    }
}