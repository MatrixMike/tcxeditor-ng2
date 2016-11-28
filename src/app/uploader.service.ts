import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { TCXData, Laps } from './editor/interfaces';

interface FileReaderEventTarget extends EventTarget {
    result:string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    // getMessage():string;
}
var xml2js = require('xml2js');
var parseString = xml2js.parseString;

@Injectable()
export class UploaderService {
    dummyData: string = '/assets/demo.tcx';
    // (window.location.hostname.match(/herokuapp/)) ? 'https://tcx-editor.herokuapp.com' : 'http://localhost:5000';

    constructor(public http: Http) { }

    readBlob(blob) {
        return new Promise((resolve, reject) => {
            console.log('Upload.service: reading', blob.name);

            // Error if not passed an objectToRead or if it is not a Blob
            if (!blob || !(blob instanceof Blob)) {
                return console.log('NoValidBlob');
            }

            var reader = new FileReader();

            reader.onload = function (evt: FileReaderEvent) {
                console.log(evt);
                resolve(evt.target.result);
            };

            reader.onerror = function (ev) {
                console.log('blob load error');
                reject(ev);
            };

            reader['readAsText'](blob);
        });
    }

    xml2json(xmlString): Promise<TCXData> {
        return new Promise((resolve, reject) => {
            parseString(xmlString, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        })
    }

    json2xml(json): string {
        const builder = new xml2js.Builder();
        return builder.buildObject(json);
    }

    getDummyData() {
        return this.http.get(this.dummyData)
            .map(res => res.text());
    }


}
