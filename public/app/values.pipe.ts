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
		let dataArr = [];
		let searchText = args[0].toUpperCase();

		if (value != undefined && value != null) {
			Object.keys(value).forEach(function(key) {
				if (value[key].active && (value[key].first.toUpperCase().indexOf(searchText) > -1 || 
					value[key].last.toUpperCase().indexOf(searchText) > -1 || 
					value[key].practice.toUpperCase().indexOf(searchText) > -1 ||
					value[key].unit.toUpperCase().indexOf(searchText) > -1 ||
					value[key].title.toUpperCase().indexOf(searchText) > -1)
				) {
					dataArr.push(value[key]);
				}
			});
		}

		return dataArr;
	}
}