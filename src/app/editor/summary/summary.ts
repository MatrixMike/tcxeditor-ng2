import {Component, Input, OnInit} from '@angular/core';
import {NgFor} from '@angular/common';

import {SummaryData} from '../interfaces';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss'],
})
export class SummaryComponent implements OnInit {
    @Input() data: SummaryData[];
    rideDate: Date;

    ngOnInit() {
      if (this.data.length > 0) {
        this.rideDate = this.data[0].startTime;
      }
    }
}
