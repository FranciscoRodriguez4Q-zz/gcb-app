import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorServiceCountryComponent } from './vendor-service-country.component';

describe('VendorServiceCountryComponent', () => {
  let component: VendorServiceCountryComponent;
  let fixture: ComponentFixture<VendorServiceCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorServiceCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorServiceCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
