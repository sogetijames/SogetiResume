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

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
	transform(value: any, args: any[]): Object[] {
		let usersObject = value;
		let filterObject = args[0];
		let retArray = [];

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