import { Injectable } from "@angular/core";

import { FIREBASE_REF } from './'

@Injectable()
export class FirebaseData {
  public practices: any;
  public statuses: any;
  public titles: any;
  public units: any;
  public proficiency: any;

  constructor() {
    ['practices', 'proficiency', 'statuses', 'titles', 'units'].forEach((key) => {
      FIREBASE_REF.child('constants').child(key).on('value', (dataSnapshot) => {
        this[key] = dataSnapshot.val();
      })
    });  
  }

  public getDataOnce(child: string) {
    return FIREBASE_REF.child(child).once('value');
  }
}