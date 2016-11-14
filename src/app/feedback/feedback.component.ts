import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';

import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  locations: FirebaseListObservable<Object>;
  comments: FirebaseListObservable<Object>;

  constructor(private af: FirebaseService) { 
    this.locations = this.af.locations;
    this.comments = this.af.comments;
  }

  ngOnInit() {
    // this.af.getData();
  }

}
