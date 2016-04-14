import {Component,Input} from 'angular2/core';

@Component({
	selector: 'user-detail',
	template: `<input [(ngModel)]="user.name" placeholder="name"/>`,
})

export class UserDetailComponent {
	@Input()
	user: Object;
}