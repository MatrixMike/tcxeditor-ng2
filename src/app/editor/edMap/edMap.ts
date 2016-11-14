import {
    Component, Input, Output, EventEmitter,
    OnInit, OnChanges, SimpleChange, NgZone} from '@angular/core';
import {findClosest} from '../helpers';
import {TpSelectionEvent, Laps, Lap, Trackpoint} from '../interfaces';

// import 'google-maps';

@Component({
    selector: 'app-map',
    templateUrl: './edMap.html',
    styleUrls: ['./edMap.scss']
})
export class MapComponent implements OnInit, OnChanges {
    @Input() lapsData: Laps;
    @Input() selectedTps: Object;
    @Output() clickHandler = new EventEmitter();
    map: google.maps.Map;
    cyclePath: google.maps.Polyline;

    constructor(public zone: NgZone) {}

    ngOnInit() {
        console.log('map init');

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(52, 0),
            zoom: 7
        });

        this.map.addListener('click', (e) => {
            let closest = findClosest(this.lapsData, e.latLng);

            let event:TpSelectionEvent = {
                lap: closest[0],
                tp: closest[1],
                shift:false
            };

            this.zone.run( () => {
                this.clickHandler.next(event);
                console.log(closest);
            });
        });

        this.map.addListener('zoom_changed', () => {
            this.drawRoute(false);
        });

        if (this.lapsData.length > 0) {
            this.drawRoute();
        }
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        console.log('ngOnChanges = ', changes['selectedTps']);
        if (this.map) {
            this.drawRoute();
            // google.maps.event.trigger(this.map,'resize');
        }
    }

    drawRoute(fitBounds = true) {
        var mybounds, skipCount;

        skipCount = this.skipCount(this.map.getZoom());

        // remove existing points
        if (this.cyclePath) {
            this.cyclePath.setMap(null);
        }

        mybounds = new google.maps.LatLngBounds();

        let vertices = this.lapsData.reduce( (acc, lap: Lap) => {
            let lapPts = lap.Track[0].Trackpoint.reduce( (accInner:Trackpoint[], tp:Trackpoint, idx:number) => {
                var c, lat, lng, marker, markerOptions;
                if (idx % skipCount === 0) {
                    lat = parseFloat(tp.Position[0].LatitudeDegrees[0]);
                    lng = parseFloat(tp.Position[0].LongitudeDegrees[0]);
                    c = new google.maps.LatLng(lat, lng);
                    mybounds.extend(c);
                    return [{ lat: parseFloat(tp.Position[0].LatitudeDegrees[0]), 
                              lng: parseFloat(tp.Position[0].LongitudeDegrees[0])}, ...accInner];
                } else {
                    return accInner;
                }
            
            }, []);
            return acc.concat(lapPts); 
        }, []);

        this.cyclePath = new google.maps.Polyline({
            path: vertices,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 4
        });

        this.cyclePath.setMap(this.map);

        google.maps.event.addListener(this.cyclePath, 'click', (e) => {
            let closest = findClosest(this.lapsData, e.latLng);

            let event:TpSelectionEvent = {
                lap: closest[0],
                tp: closest[1],
                shift:false
            };

            this.zone.run( () => {
                this.clickHandler.next(event);
                console.log('cyclepath', closest);
            });
        });


        if (fitBounds)
            this.map.fitBounds(mybounds);
    }

    skipCount(z) {
        switch(z) {
            case 10: return 60;
            case 11: return 28;
            case 12: return 20;
            case 13: return 16;
            case 14: return 8;
            case 15: return 4;
            default: return 1;
        }
    }

}
