import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleExComponent } from './sample-ex.component';

describe('SampleExComponent', () => {
  let component: SampleExComponent;
  let fixture: ComponentFixture<SampleExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
