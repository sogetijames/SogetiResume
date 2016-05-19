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
        let authData = FIREBASE_REF.getAuth();

        if (authData) {
            this.authenticationService.logout();
            window.location.href = '/login';
        } else {
            this.router.navigate(['/login']);
        }
    }
}