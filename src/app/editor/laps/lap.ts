import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Trackpoint} from '../interfaces';

// <input type="checkbox" (click)='handleLapClick($event)'>
@Component({
    selector: 'app-lap',
    template: `
    <header>        
        Lap {{index + 1}}
    </header>
    <app-trackpoint
        *ngFor='let tp of lapData; let i=index'
        [ngClass]="{selected:selectedTps[i]}"
        id='{{"tp"+index+"-"+i}}'
        [tp]='tp'
        [checked]='selectedTps[i]'
        (clicked)='handleClick(i)($event)'>
    </app-trackpoint>
  `,
    styles: [`
        app-trackpoint {
            display: block;
        }
        app-trackpoint:hover {
            cursor: pointer;
            background-color: rgb(245, 206, 201);
        }
        app-trackpoint.selected {
            background-color: rgb(244, 233, 203);
        }
    
    `]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LapComponent {
    @Input() lapData: Trackpoint[];
    @Input() selectedTps: Object;
    @Input() index: number;
    @Output() lapEventHandler = new EventEmitter();

    handleClick(i: number) {
        return (childEvent: {shift: boolean}) => {
            console.log('LapComponent.handleClick', i, childEvent);
            this.lapEventHandler.next({
                tp: i,
                lap: this.index,
                shift: childEvent.shift
            });            
        }
        // console.log(i, evt);
        // this.lapEventHandler.next({
        //     tp: i,
        //     lap: this.index,
        //     shift: evt.shiftKey
        // });
    }
    handleLapClick() {
        console.log('i, evt');
    }

}
