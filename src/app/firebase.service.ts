import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class FirebaseService {

    firebaseComments: FirebaseListObservable<Object[]>;
    comments: Observable<Object[]>;
    locations: FirebaseListObservable<Object>;

    constructor(private af: AngularFire) {
        this.firebaseComments = 
            this.af.database.list(environment.stem + '/comments');
        
        this.comments =
                this.firebaseComments.map(data => {
                    return data.map(v => Object.assign(v, {date: new Date(v['date'])}))
                        .sort( (c1, c2) => c2.date.valueOf() - c1.date.valueOf() );
                })

            // this.af.database.list(environment.stem + '/comments', {
            //     query: {
            //         orderByChild: 'date'
            //     }
            // });
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
        return this.firebaseComments.push(this.insertDate(comment))
            .catch(err => console.error(err));
    }

    saveAnalytics(location) {
        return this.locations.push(this.insertDate(location))
            .catch(err => console.error(err));
    }
}
