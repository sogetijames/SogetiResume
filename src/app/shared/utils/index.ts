export * from './current-user';
export * from './firebase-data';

export const FIREBASE_REF: Firebase = new Firebase('https://dazzling-inferno-8835.firebaseio.com');

export function dynamicSort(property: any) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: any, b: any) {
      var result: any;
      if (typeof a[property] === 'string') {
        result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;

      } else {
        result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      }
        return result * sortOrder;
    }
};