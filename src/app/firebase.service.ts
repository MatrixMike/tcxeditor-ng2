import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { environment } from '../environments/environment';

@Injectable()
export class FirebaseService {

    comments: FirebaseListObservable<Object>;
    locations: FirebaseListObservable<Object>;

    constructor(private af: AngularFire) {
        this.comments = 
            this.af.database.list(environment.stem + '/comments');
        this.locations = 
            this.af.database.list(environment.stem + '/locations');
    }

    insertDate(v: Object): Object {
        let d = new Date();
        let s = d.toString();
        console.log(Object.assign({ "date": s }, v));
        return Object.assign({ "date": s }, v);
    }

    addComment(comment) {
        return this.comments.push(this.insertDate(comment))
            .catch(err => console.error(err));
    }

    saveAnalytics(location) {
        return this.locations.push(this.insertDate(location))
            .catch(err => console.error(err));
    }
}
