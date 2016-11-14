/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UploaderService } from './uploader.service';

describe('Service: Uploader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploaderService]
    });
  });

  it('should ...', inject([UploaderService], (service: UploaderService) => {
    expect(service).toBeTruthy();
  }));
});
