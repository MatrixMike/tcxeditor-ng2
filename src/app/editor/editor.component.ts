import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {Router} from '@angular/router';

import { EditorService } from '../editor.service';
import {    getSummaryData, deletePoints } from './helpers';
import {SummaryData, Laps, TpSelectionEvent} from './interfaces';

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
    comments = [];
    changesMade: boolean = false;
    rawLapsData: Laps = [];
    summaryData: SummaryData[] = [];
    tcxData: SafeUrl;

    constructor(private router: Router,
                private sanitizer: DomSanitizer,
                private editor: EditorService,
                private fb: FirebaseService) { }


    ngOnInit() {
        if (this.editor && this.editor.data) {
            this.getEditorData();
        } else {
            console.log('Entering on editor prohibited')
            this.router.navigate(['upload']);
            // this.editor.getDemoData()
            //   .subscribe( json => {
            //     this.editor.setTcxData('demo.tcx', json);
            //     this.getEditorData();
            // })
          
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
        console.log(e);
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

    mapClickHandler(e: TpSelectionEvent) {
        this.clickedTp = e;
        this.lastClick = e;
    }
    initialiseSelectedTps() {
        this.selectedTps = {};
        for (var i=0; i<this.rawLapsData.length; i++) {
            this.selectedTps[i] = {};
        }
    }
     deleteSelectedTps() {
        let tmp = deletePoints(this.rawLapsData, this.selectedTps);
        // this.rawLapsData = deletePoints(this.rawLapsData, this.selectedTps);
        this.rawLapsData = tmp;
        // shoudl not be needed as we have passed object around by ref
        // this.main.replaceLaps(tmp);
        this.changesMade = true;

        this.initialiseSelectedTps();
        this.summaryData = getSummaryData(this.rawLapsData);

        // Create download string 
        this.tcxData = this.sanitizer.bypassSecurityTrustUrl("data:text/xml," + this.editor.getXml());   
    }
    // getData() {
    //     let dataString = "data:text/xml,";
    //     let xmlString = "<root>Hello xml2js!</root>";

    //     return this.sanitizer.bypassSecurityTrustUrl(dataString + xmlString);
    // }


  handleComment(commentObj) {
    //    console.log(commentObj);
       this.fb.addComment(commentObj);
        // this.main.postNewComment(commentObj)
        // .subscribe( res => {
        //     // console.log(res);
        //     this.comments =
        //         res.sort( (r1, r2) => r2.date - r1.date );
        // });
    }
}
