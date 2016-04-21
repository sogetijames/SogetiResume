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

		if (value != undefined && value != null) {
			Object.keys(value).forEach(function(key) {
				if (value[key].first.toUpperCase().indexOf(args[0].toUpperCase()) > -1 || 
					value[key].last.toUpperCase().indexOf(args[0].toUpperCase()) > -1 ||
					value[key].unit.toUpperCase().indexOf(args[0].toUpperCase()) > -1 ||
					value[key].title.toUpperCase().indexOf(args[0].toUpperCase()) > -1
				) {
					dataArr.push(value[key]);
				}
			});
		}

		return dataArr;
	}
}