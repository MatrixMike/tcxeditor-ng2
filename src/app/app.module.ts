import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { MaterialModule } from '@angular/material';

import { RouterModule }   from '@angular/router';
import { Routes } from './routing';

import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { FeedbackComponent } from './feedback/feedback.component';

import { EditorComponent } from './editor/editor.component'
import { SummaryComponent} from './editor/summary/summary';
import { MapComponent} from './editor/edMap/edMap';
import { LapsComponent} from './editor/laps/laps';
import { LapComponent} from './editor/laps/lap';
import { TrackpointComponent } from './editor/laps/trackpoint';
import { FeedbackWidgetComponent } from './editor/edFeedback/edFeedback';

import { UploaderService } from './uploader.service';
import { EditorService } from './editor.service';
import { FirebaseService } from './firebase.service';

import { ToDatePipe } from './pipes/ToDatePipe';
import { ToKmPipe } from './pipes/ToKmPipe';

  // Break apart for some security
  var firebaseConfig = {
    apiKey: "AIzaSyAASN0vGCQ3zp"+"ibVrFy6ZbaMES6ulLLm5E",
    authDomain: "tcx-editor.firebaseapp.com",
    databaseURL: "https://tcx-editor.firebaseio.com",
    storageBucket: "tcx-editor.appspot.com",
    messagingSenderId: "129985837330"
  };

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    FeedbackComponent,
    EditorComponent,
    SummaryComponent,
    MapComponent,
    LapsComponent,
    LapComponent,
    TrackpointComponent,
    FeedbackWidgetComponent,
    ToDatePipe,
    ToKmPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(Routes),
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot()
  ],
  providers: [ 
    UploaderService,
    EditorService,
    FirebaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
