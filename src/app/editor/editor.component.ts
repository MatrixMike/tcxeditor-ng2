import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';

import { EditorService } from '../editor.service';
import { findClosest, getSummaryData, deletePoints } from './helpers';
import { SummaryData, Laps, TpSelectionEvent } from './interfaces';

import { FirebaseService } from '../firebase.service';


@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
    lastClick: TpSelectionEvent;
    clickedTp: TpSelectionEvent;
    fname: string = 'todelete.tcx';
    selectedTps: Object = {};
    // comments: FirebaseListObservable<any>;
    comments: Observable<any>;
    changesMade: boolean = false;
    rawLapsData: Laps = [];
    summaryData: SummaryData[] = [];
    tcxData: SafeUrl;
    lapScrollTo: number;

    constructor(private router: Router,
        private sanitizer: DomSanitizer,
        private editor: EditorService,
        private fb: FirebaseService,
        private zone: NgZone) { }

    ngOnInit() {
        if (this.editor && this.editor.data) {
            this.getEditorData();
        } else {
            // console.log('Entering on editor prohibited')
            // this.router.navigate(['upload']);
            this.editor.getDemoData()
              .subscribe( json => {
                this.editor.setTcxData('demo.tcx', json);
                this.getEditorData();
            });
        }
    }

    getEditorData() {
        this.fname = this.editor.fname;
        // pointer to the Laps section of the file
        this.rawLapsData = this.editor.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap;

        this.initialiseSelectedTps();

        this.summaryData = getSummaryData(this.rawLapsData);
    }

    lapsHandler(e: TpSelectionEvent) {
        console.log('lapsHandler', e);
        if (e.shift && e.lap === this.lastClick.lap) {
            // console.log(e.tp, this.lastClick.tp);
            let mn = Math.min(e.tp, this.lastClick.tp);
            let mx = Math.max(e.tp, this.lastClick.tp);
            let newVal = !this.selectedTps[e.lap][e.tp];

            for (var i = mn; i <= mx; i++) {
                this.selectedTps[e.lap][i] = newVal;
            };
        } else {
            this.selectedTps[e.lap][e.tp] = !this.selectedTps[e.lap][e.tp];
        }
        this.lastClick = e;
    }

    // On a mouse click, scroll to tp and select it 
    mapClickHandler(evt) {
        let closest = findClosest(this.rawLapsData, evt.latLng);

        let event = {
            lap: closest[0],
            tp: closest[1],
            shift: false
        };

        this.zone.run( () => {
            // console.log('mapClickHandler', event);
            this.lapsHandler(event);
            let off = Math.max(0, document.querySelector('#tp'+event.lap+'-'+event.tp)['offsetTop'] - 40);
            console.log(`#tp${event.lap}-${event.tp} at ${off}`);
            // document.querySelector('#lapContainer').scrollTop = off;
            this.lapScrollTo = off;
        });
    }

    initialiseSelectedTps() {
        this.selectedTps = {};
        for (var i = 0; i < this.rawLapsData.length; i++) {
            this.selectedTps[i] = {};
        }
    }
    deleteSelectedTps() {
        let tmp = deletePoints(this.rawLapsData, this.selectedTps);
        // this.rawLapsData = deletePoints(this.rawLapsData, this.selectedTps);
        this.rawLapsData = tmp;
        // should not be needed as we have passed object around by ref
        // this.main.replaceLaps(tmp);
        this.changesMade = true;

        this.initialiseSelectedTps();
        this.summaryData = getSummaryData(this.rawLapsData);

        // Create download string 
        this.tcxData = this.sanitizer.bypassSecurityTrustUrl("data:text/xml," + this.editor.getXml());
    }

    handleComment(commentObj) {
        this.fb.addComment(commentObj);
        // Now show user the other comments
        this.comments = 
            this.fb.comments            
                .map(v => {
                    console.log(v);
                    v['date'] = new Date(v['date']);
                    return v;
                });
    }
}
