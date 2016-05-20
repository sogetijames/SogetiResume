import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { FIREBASE_REF, CurrentUser } from '../../shared';
import { AuthenticationService } from '../';

@Component({
    selector: 'user-reset-password',
    templateUrl: './app/+users/user-reset-password/user-reset-password.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthenticationService]
})
export class UserResetPasswordComponent implements OnInit { 
    email: string;

    constructor(
        private router: Router, 
        private authenticationService: AuthenticationService,
        private currentUser: CurrentUser
    ) { }

    ngOnInit() {
        if (firebase.auth().currentUser) {
            this.router.navigate(['/resume', this.currentUser.info.username]);
        }

        this.email = '';
    }

    onClickResetPassword() {
        if (this.email != '') {
            this.authenticationService.sendPasswordResetEmail(this.email, (error: any) => {
                // TODO: implement call to confirm password reset
            });
        } 
    }
}