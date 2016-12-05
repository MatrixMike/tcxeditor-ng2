import {Component, Input, Output, EventEmitter,  
        OnChanges, SimpleChange, ChangeDetectionStrategy} from '@angular/core';
import {NgFor} from '@angular/common';

// import {LapCmp} from './lap';
import {TpSelectionEvent} from '../interfaces';


@Component({
  selector: 'app-laps',
  template: `
    <header>
      <div class="timestamp">Time</div>
      <div class="distance">Distance</div>
    </header>
    <div class='lapContainer' id='lapContainer' [scrollTo]='lapScrollTo' >
      <app-lap
          *ngFor="let lap of lapsData; let i=index"
          [lapData]="lap.Track[0].Trackpoint"
          [selectedTps]="selectedTps[i]"
          [index]="i"
          (lapEventHandler)="lapsHandler.next($event)">
      </app-lap>
    </div>
  `,
  styleUrls: ['./lap.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LapsComponent implements OnChanges {
    @Input() lapsData: Object[];
    @Input() selectedTps: Object;
    @Input() mapClickedTp: TpSelectionEvent;
    @Input() lapScrollTo: TpSelectionEvent;
    @Output() lapsHandler = new EventEmitter();

    constructor() {}

    // handleClick(e) {
    //   // console.log(e);
    //   // pass up the click event
    //   this.lapsHandler.next(e);
    // }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // console.log('ngOnChanges = ', changes);
        // mapClickedTp is initially undefined and should be ignored
        // if (changes.hasOwnProperty('mapClickedTp') &&
        //     changes['mapClickedTp'].currentValue) {

        //     let evt:TpSelectionEvent = changes['mapClickedTp'].currentValue;

        //     console.log(evt.lap, evt.tp);

        //     this.selectedTps[evt.lap][evt.tp] = true;

        //     var lapsContainer = document.getElementById('lapContainer');
            // const options: ScrollIntoViewOptions = {
            //   block: 'start',
            //   behavior: 'smooth'
            // }
            // lapsContainer.children[evt.lap].children[evt.tp].scrollIntoView(options);
        // }
    }
}
