import { TestBed } from '@angular/core/testing';

import { ProductServiceTypeService } from './product-service-type.service';

describe('SampleExService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductServiceTypeService = TestBed.get(ProductServiceTypeService);
    expect(service).toBeTruthy();
  });
});
