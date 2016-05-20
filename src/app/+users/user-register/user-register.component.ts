import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FIREBASE_REF, CurrentUser, FirebaseData } from '../../shared';
import { AuthenticationService } from '../';

@Component({
    selector: 'user-register',
    templateUrl: './app/+users/user-register/user-register.component.html',
    styleUrls: ['./app/+users/user-register/user-register.component.css'],
    providers: [AuthenticationService]
})
export class UserRegisterComponent implements OnInit { 
    userDetails: any;
    usernameExists: boolean;

    constructor(
        private router: Router, 
        private authenticationService: AuthenticationService,
        private currentUser: CurrentUser,
        private firebaseData: FirebaseData
    ) { }

    ngOnInit() {
        if (firebase.auth().currentUser) {
            this.router.navigate(['/resume', this.currentUser.info.username]);
        }

        this.usernameExists = true;
        this.userDetails = {
            email: '',
            first: '',
            last: '',
            password: '',
            passwordConfirm: '',
            practice: '',
            title: '',
            unit: '',
            username: ''
        };
    }

    onClickCreate() {
        if (this.verifyAllFieldsNotBlank() && !this.usernameExists) {
            this.authenticationService.createUser(this.userDetails, (error: any) => {
                if (error) {
                    this.userDetails.password = '';
                    this.userDetails.passwordConfirm = '';
                    toastr.error(error.message, error.code);
                } else {
                    //this.router.navigate(['/resume', this.currentUser.info.username]);
                }
            });
        }
    }

    validatePasswordsMatch() {
        if (this.userDetails.password == '') {
            return false;
        } else {
            return this.userDetails.password == this.userDetails.passwordConfirm;
        }
    }

    checkIfUsernameExists() {
        if (this.userDetails.username != '') {
            this.authenticationService.checkIfUsernameExists(this.userDetails.username, (exists: boolean) => {
                if (exists) {
                    this.usernameExists = true;
                } else {
                    this.usernameExists = false;
                }
            });
        }
    }

    private verifyAllFieldsNotBlank() {
        return (
            this.userDetails.email != '' && 
            this.userDetails.first != '' && 
            this.userDetails.last != '' && 
            this.userDetails.password != '' &&
            this.userDetails.passwordConfirm != '' &&
            this.userDetails.username != ''
        );
    }
}