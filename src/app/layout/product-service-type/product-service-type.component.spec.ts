import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductServiceTypeComponent } from './product-service-type.component';

describe('ProductServiceTypeComponent', () => {
  let component: ProductServiceTypeComponent;
  let fixture: ComponentFixture<ProductServiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductServiceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
