import { TestBed } from '@angular/core/testing';

import { ServiceTypeService } from './service-type.service';

describe('SampleExService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceTypeService = TestBed.get(ServiceTypeService);
    expect(service).toBeTruthy();
  });
});
