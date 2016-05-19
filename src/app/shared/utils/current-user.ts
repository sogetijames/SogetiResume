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

    public setCurrentUser(authData: any) {
        if (authData != null) {
            this.auth = authData;

            FIREBASE_REF.child('users').child(authData.uid).on('value', info => {
                this.info = info.val();
            });
        }
    }
}