import { Component, ViewEncapsulation } from '@angular/core';

import { MdToolbar } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title: string = 'init';

  constructor() { }


}
