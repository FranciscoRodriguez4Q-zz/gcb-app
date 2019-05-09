import { TestBed } from '@angular/core/testing';

import { SampleExService } from './sample-ex.service';

describe('SampleExService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SampleExService = TestBed.get(SampleExService);
    expect(service).toBeTruthy();
  });
});
