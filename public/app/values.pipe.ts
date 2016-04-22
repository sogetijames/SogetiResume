import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
    transform(value: any): Object[] {
        let dataArr = [];

        if (value != undefined && value != null) {
            Object.keys(value).forEach(function(key) {
                dataArr.push(value[key]);
            });
        }
        
        return dataArr;        
    }
}

@Pipe({name: 'search'})
export class SearchPipe implements PipeTransform {
	transform(value: any, args: any[]): Object[] {
		let usersObject = value;
		let skillsObject = args[0];
		let searchText = args[1].toUpperCase();
		let retArray = [];

		if (usersObject != undefined && skillsObject != undefined) {
			Object.keys(usersObject).forEach(function(uid) {
				if (usersObject[uid].first.toUpperCase().indexOf(searchText) > -1 || 
					usersObject[uid].last.toUpperCase().indexOf(searchText) > -1 || 
					usersObject[uid].practice.toUpperCase().indexOf(searchText) > -1 ||
					usersObject[uid].unit.toUpperCase().indexOf(searchText) > -1 ||
					usersObject[uid].title.toUpperCase().indexOf(searchText) > -1
				) {
					retArray.push(usersObject[uid]);
				}

				if (skillsObject[uid] != undefined) {
					Object.keys(skillsObject[uid]).forEach(function(skill) {
						if (skill.toUpperCase().indexOf(searchText) > -1 && retArray.indexOf(usersObject[uid]) == -1) {
							retArray.push(usersObject[uid]);
						}
					});					
				}
			});
		}

		return retArray;
	}
}