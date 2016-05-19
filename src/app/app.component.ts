import { Component, OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AdminComponent } from './+admin';
import { ResumeDetailComponent, ResumesComponent } from './+resumes';
import { 
    AuthenticationService, 
    UserLoginComponent, 
    UserSettingsComponent, 
    UserRegisterComponent,
    UserResetPasswordComponent 
} from './+users';
import { CurrentUser, FIREBASE_REF } from './shared';

@Component({
    selector: 'sogeti-resume',
    templateUrl: "./app/app.component.html",
    providers: [
        ROUTER_PROVIDERS, 
        AuthenticationService
    ],
    directives: [
        ROUTER_DIRECTIVES
    ]
})
@Routes([
    { path: '/',                 component: ResumesComponent },
    { path: '/resume/:username', component: ResumeDetailComponent },

    { path: '/login',            component: UserLoginComponent },
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
            this.currentUser.setCurrentUser(authData);
        });    
    }

    constructor(
        private currentUser: CurrentUser,
        private authenticationService: AuthenticationService 
    ) { }

    onClickLogout() {
        this.authenticationService.logout();
        this.currentUser.resetCurrentUser();
    }
}