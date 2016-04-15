import {Component,Input} from 'angular2/core';

@Component({
	selector: 'user-detail',
	templateUrl: '../views/profile.html',
})

export class UserDetailComponent {
	@Input()
	user: Object;
}