import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { environment } from '../environments/environment';


@Injectable()
export class FirebaseService {

  comments: FirebaseListObservable<Object>;
  locations: FirebaseListObservable<Object>;

  constructor(private af: AngularFire) {
      this.comments = this.af.database.list(environment.stem + '/comments');
      this.locations = this.af.database.list(environment.stem + '/locations');    
  }

  // getData() {
  //   if (this.comments === undefined) {
  //     this.comments = this.af.database.list(environment.stem + '/comments');
  //   }
  //   if (this.locations === undefined) {
  //     this.locations = this.af.database.list(environment.stem + '/locations');
  //   }
  // }

  insert(stem, v) {
    let d = new Date()
    let c = Object.assign({date: d.toString()}, v);
    console.log('pushing to', environment.stem + stem);
    return this.af.database.list(environment.stem + stem)
      .push(c);
  }

  addComment(comment) {
    return this.comments.push(comment)
      .catch(err => console.error(err));
    // return this.insert('/comments', comment);
  }

  saveAnalytics(location) {
    return this.locations.push(location)
      .catch(err => console.error(err));
    // return this.insert('/locations', location);
  }
}
