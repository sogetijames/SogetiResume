import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { FIREBASE_REF, CurrentUser } from '../../shared';
import { AuthenticationService } from '../';

@Component({
    selector: 'user-logout',
    template: '',
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthenticationService]
})
export class UserLogoutComponent implements OnInit { 

    constructor(
        private router: Router, 
        private authenticationService: AuthenticationService,
        private currentUser: CurrentUser
    ) { }

    ngOnInit() {
        if (firebase.auth().currentUser) {
            this.authenticationService.signOut();
            window.location.href = '/login';
        } else {
            this.router.navigate(['/login']);
        }
    }
}