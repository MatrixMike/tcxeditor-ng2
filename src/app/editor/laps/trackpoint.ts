import {Component, Input, Output, EventEmitter} from '@angular/core';

import { Trackpoint } from '../interfaces';

@Component({
    selector: 'app-trackpoint',
    template: `
    <label>
      <input type="checkbox" [checked]='checked' (click)='handleClick($event)'>
        <div class='timestamp'>{{tp.Time[0] | toDate | date:'HH:mm:ss'}}</div>
        <div class='distance'>{{tp.DistanceMeters[0] | toKm | number:'1.2-2'}} km</div>
   </label>
  `,
//     template: `
//       <md-checkbox [checked]='checked' (click)='handleClick($event)'>
//         <div class='timestamp'>{{tp.Time[0] | toDate | date:'HH:mm:ss'}}</div>
//         <div class='distance'>{{tp.DistanceMeters[0] | toKm | number:'1.2-2'}} km</div>
//       </md-checkbox>
//   `,
    styles: [`
        div {
            display: inline-block;
            margin-left: 20px;
        }
    `]
})
export class TrackpointComponent {
    @Input() tp: Trackpoint;
    @Input() checked: boolean;
    @Output() clicked = new EventEmitter();
    constructor() {}

    handleClick(evt: MouseEvent) {
        console.log(evt);
        this.clicked.next({
            shift: evt.shiftKey
        })
    }
}
