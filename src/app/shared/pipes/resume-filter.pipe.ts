import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'resumeFilter'})
export class ResumeFilterPipe implements PipeTransform {
	transform(value: any, args: any[]): Object[] {
		let usersObject = value;
		let filterObject = args;
		let retArray: any[] = [];

		if (usersObject != undefined && filterObject != undefined) {
			Object.keys(usersObject).forEach((uid) => {
				let filterKey = Object.keys(filterObject)[0];
				let filterText = filterObject[filterKey];

				if (filterText == '') {
					retArray.push(usersObject[uid]);
				} else if (filterKey == 'status') {
					if (usersObject[uid][filterKey]['text'].indexOf(filterObject[filterKey]) > -1 && 
						retArray.indexOf(usersObject[uid]) == -1
					) {
						retArray.push(usersObject[uid]);
					} 
				} else {
					if (usersObject[uid][filterKey].indexOf(filterObject[filterKey]) > -1 && 
						retArray.indexOf(usersObject[uid]) == -1
					) {
						retArray.push(usersObject[uid]);
					} 
				}
			});
		}

		return retArray;
	}
}