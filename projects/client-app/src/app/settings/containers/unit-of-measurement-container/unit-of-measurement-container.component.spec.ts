import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurementContainerComponent } from './unit-of-measurement-container.component';

describe('UnitOfMeasurementContainerComponent', () => {
  let component: UnitOfMeasurementContainerComponent;
  let fixture: ComponentFixture<UnitOfMeasurementContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitOfMeasurementContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasurementContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
