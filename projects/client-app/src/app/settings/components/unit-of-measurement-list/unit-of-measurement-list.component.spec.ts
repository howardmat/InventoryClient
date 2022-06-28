import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurementListComponent } from './unit-of-measurement-list.component';

describe('UnitOfMeasurementListComponent', () => {
  let component: UnitOfMeasurementListComponent;
  let fixture: ComponentFixture<UnitOfMeasurementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitOfMeasurementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasurementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
