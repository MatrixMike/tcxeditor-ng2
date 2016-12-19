import { Component, OnInit } from '@angular/core';
import { TCXData } from '../editor/interfaces';

import { Router } from '@angular/router';
import { UploaderService } from '../uploader.service';
import { EditorService } from '../editor.service';
import { FirebaseService } from '../firebase.service';

interface Blob {
    name: string
}


@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
    browseButton: string;
    demoButton: string;

    constructor(private router: Router,
        private uploader: UploaderService,
        private editor: EditorService,
        private fb: FirebaseService) { }

    ngOnInit() {
        this.browseButton = 'choose .tcx file';
        this.demoButton = 'Load demo data';
    }
    demo() {
        this.demoButton = 'Converting...';
        this.uploader.getDummyData()
            .subscribe(rawTcx => {
                this.uploader.xml2json(rawTcx)
                    .then(json => {
                        this.editor.setTcxData('demo.tcx', json);
                        this.router.navigate(['editor']);
                    })
                    .catch(err => {
                        console.log(err)
                    });
            });
    }

    upload(e) {
        this.browseButton = 'Loading...';
        let blob: Blob = e.target.files[0];

        this.uploader.readBlob(blob)
            .then((res: string) => {
                this.browseButton = 'Converting...';
                // console.log(typeof res);
                return this.uploader.xml2json(res);
            })
            .then((json:TCXData) => {
                // console.log(json);
                // store data in Editor service
                this.editor.setTcxData(blob.name, json);
                // Send first value to analytics
                this.fb.saveAnalytics(this.editor.getFirstValue());

                this.router.navigate(['editor']);
            })
            .catch( err => console.error(err) );
    }

}
