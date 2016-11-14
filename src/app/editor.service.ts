import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { TCXData, Laps } from './editor/interfaces';
import {UploaderService} from './uploader.service';

var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');

@Injectable()
export class EditorService {
    data: TCXData;
    fname: string;

    constructor(private http: Http, private uploader: UploaderService) { }
    dummyData: string = '/assets/demo.tcx';

    setTcxData(fname: string, data: TCXData) {
        // console.log('MainSvc: setTcxData', data);
        this.data = data;
        this.fname = fname;

        // Filter out points that have no position data
        var laps = this.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap;
        var newLaps = laps.map((lap, idx) => {
            var lapPoints = lap.Track[0].Trackpoint;

            // we only want points that has a Position element
            var newLapPoints = lapPoints.filter(elem => elem.Position);

            if (lapPoints.length > newLapPoints.length) {
                console.log('Lap %s had %s positionless elements in, which was removed',
                    idx, lapPoints.length - newLapPoints.length);
            }
            // replace in lap
            lap.Track[0].Trackpoint = newLapPoints;
            return lap;
        });

        this.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap = newLaps;
    }

    xml2json(xmlString): Observable<TCXData> {
        return Observable.create( (observer) => {
            parseString(xmlString, (err, result: TCXData) => {
                if (err) {
                    return observer.error(err);
                }
                return observer.next(result);
            });
        })
    }

    getFirstValue() {
        let val = 
            this.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0].Trackpoint[0].Position[0];
        console.log('getFirstValue', val);
        return { 
            lat: val.LatitudeDegrees[0],
            lng: val.LongitudeDegrees[0]
        };
    }
    getDemoData() {
        return this.http.get(this.dummyData)
            .map(res => res.text())
            .concatMap(this.xml2json)
    }

    getXml(): string {
        const builder = new xml2js.Builder();
        return builder.buildObject(this.data);
    }
}
