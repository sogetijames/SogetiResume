import { Component, OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {
    AdminComponent,
    CurrentUser,
    FIREBASE_REF,
    FIREBASE_AUTH,
    ResumeDetailComponent,
    ResumesComponent,
    UserLoginComponent, 
    UserLogoutComponent,
    UserRegisterComponent,
    UserResetPasswordComponent
} from './';

@Component({
    selector: 'sogeti-resume',
    templateUrl: "./app/app.component.html",
    providers: [
        ROUTER_PROVIDERS
    ],
    directives: [
        ROUTER_DIRECTIVES
    ]
})
@Routes([
    { path: '/',                 component: ResumesComponent },
    { path: '/resume/:username', component: ResumeDetailComponent },

    { path: '/login',            component: UserLoginComponent },
    { path: '/logout',           component: UserLogoutComponent },
    { path: '/register',         component: UserRegisterComponent },
    { path: '/reset',            component: UserResetPasswordComponent },
    
    { path: '/admin',            component: AdminComponent },

    { path: '*',                 component: ResumesComponent }
])
export class AppComponent implements OnInit {

    ngOnInit() {
        toastr.options.positionClass = "toast-top-right";

        let user = FIREBASE_AUTH.currentUser;
        if (user) {
            this.currentUser.setCurrentUser(user);
        }

        FIREBASE_AUTH.onAuthStateChanged((user: any) => {
            if (user) {
                this.currentUser.setCurrentUser(user);
            } else {
                this.currentUser.resetCurrentUser();
            }
        });   
    }

    constructor(
        private currentUser: CurrentUser
    ) { }
}