import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseListObservable } from 'angularfire2';

import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  comments: Observable<Object>;
  locations: any;
  map: google.maps.Map;

  constructor(private af: FirebaseService) {
    this.comments = this.af.comments;
    // .map(v => Object.assign( v, {date: new Date(v['date'])} ));

    this.af.locations
      .subscribe(locs => {
        this.locations = locs;
        this.makeMarkers();
      });
  }

  ngOnInit() {
    var mapOptions = {
      zoom: 2,
      center: new google.maps.LatLng(20, 0)
    };
    this.map = new google.maps.Map(document.getElementById('map-container'), mapOptions);
    
    this.makeMarkers();
  }
  makeMarkers() {
    if (this.map && this.locations && this.locations.length) {
      this.locations.forEach(pt => {

        const lat = parseFloat(pt.lat);
        const lng = parseFloat(pt.lng);
        if (isNaN(lat) || isNaN(lng)) {
          console.error(pt);
        } else {
          var markerPos = new google.maps.LatLng(lat, lng);
          var marker = new google.maps.Marker({
            title: pt.ref,
            position: markerPos,
          });
          marker.setMap(this.map);

          // google.maps.event.addListener(
          //   marker,
          //   'click',
          //   (item => {
          //     console.log('deleting:', item.ref);
          //     // http://stackoverflow.com/questions/33564072/angular-2-0-mandatory-refresh-like-apply
          //     // this.ngZone.run( () => console.log(item.ref) );
          //   //   this.main.deleteAnalyticsPoint(item.key)
          //   //     .subscribe(res => console.log(res));
          //   }).bind(null, pt)
          // );
        }
      });
    }
  }

}
