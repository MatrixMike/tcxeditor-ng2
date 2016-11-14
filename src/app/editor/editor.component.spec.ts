/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorComponent } from './editor.component';
import { getLapsToChange } from './helpers';

const obj1 = {
  0: {
    1: false
  },
  2: {
    0: true
  },
  1: {
    2: true
  }
}

describe('Helpers', () => {
  it('getLapsToChange should handle noise', () => {
    expect(getLapsToChange(obj1)).toEqual([1, 2]);
  });
});

// describe('EditorComponent', () => {
//   let component: EditorComponent;
//   let fixture: ComponentFixture<EditorComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ EditorComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EditorComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
