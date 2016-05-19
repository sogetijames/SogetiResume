import { Component, OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {
    AdminComponent,
    CurrentUser,
    FIREBASE_REF,
    ResumeDetailComponent,
    ResumesComponent,
    UserLoginComponent, 
    UserLogoutComponent,
    UserSettingsComponent, 
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
    { path: '/settings',         component: UserSettingsComponent },
    
    { path: '/admin',            component: AdminComponent },

    { path: '*',                 component: ResumesComponent }
])
export class AppComponent implements OnInit {

    ngOnInit() {
        toastr.options.positionClass = "toast-top-right";

        let authData = FIREBASE_REF.getAuth();
        if (authData) {
            this.currentUser.setCurrentUser(authData);
        }

        FIREBASE_REF.onAuth((authData: FirebaseAuthData) => {
            if (authData == null) {
                this.currentUser.resetCurrentUser();
            } else {
                this.currentUser.setCurrentUser(authData);
            }
        });    
    }

    constructor(
        private currentUser: CurrentUser
    ) { }
}