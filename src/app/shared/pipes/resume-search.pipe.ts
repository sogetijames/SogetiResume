import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'resumeSearch'})
export class ResumeSearchPipe implements PipeTransform {
    transform(value: any, args: any[]): Object[] {
        let usersObject = value;
        let skillsObject = args[0];
        let searchText = args[1].toUpperCase();
        let retArray: any[] = [];

        if (usersObject != undefined) {
            Object.keys(usersObject).forEach(function(uid) {
                let fullname = (usersObject[uid].first + ' ' + usersObject[uid].last).toUpperCase();

                if (usersObject[uid].first.toUpperCase().indexOf(searchText) > -1 || 
                    usersObject[uid].last.toUpperCase().indexOf(searchText) > -1 || 
                    usersObject[uid].practice.toUpperCase().indexOf(searchText) > -1 ||
                    usersObject[uid].unit.toUpperCase().indexOf(searchText) > -1 ||
                    usersObject[uid].title.toUpperCase().indexOf(searchText) > -1 ||
                    fullname.indexOf(searchText) > -1
                ) {
                    retArray.push(usersObject[uid]);
                }

                if (skillsObject != undefined && skillsObject[uid] != undefined) {
                    Object.keys(skillsObject[uid]).forEach(function(index) {
                        if (skillsObject[uid][index]['name'].toUpperCase().indexOf(searchText) > -1 && retArray.indexOf(usersObject[uid]) == -1) {
                            retArray.push(usersObject[uid]);
                        }
                    });
                }
            });
        }

        return retArray;
    }
}