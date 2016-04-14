import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
    transform(value: any): Object[] {
        let dataArr = [];

        if (value != undefined || value != null) {
            Object.keys(value).forEach(function(key) {
                dataArr.push(value[key]);
            });
        }
        
        return dataArr;        
    }
}