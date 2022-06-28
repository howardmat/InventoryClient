import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { UnitOfMeasurement } from '../../models/unit-of-measurement.model';

@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
  styleUrls: ['./unit-of-measurement.component.scss']
})
export class UnitOfMeasurementComponent implements OnInit {
  id: string;
  editMode: boolean;
  form: FormGroup;
  nameFormControl = new FormControl(null, [Validators.required]);
  abbreviationFormControl = new FormControl(null, [Validators.required]);

  @Input() model: UnitOfMeasurement;

  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<UnitOfMeasurement> = new EventEmitter<UnitOfMeasurement>();

  constructor() {}

  ngOnInit(): void { 
    this.initForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(
        new UnitOfMeasurement(
          this.nameFormControl.value,
          this.abbreviationFormControl.value,
          this.model.id
        )
      );
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onReset(): void {
    this.form.reset();
  }

  getErrorMessage() {
    if (this.nameFormControl.hasError('required')) {
      return 'You must enter a value';
    }
    return 'Not a valid value';
  }

  private initForm(): void {
    if (this.model && this.model.id !== '') {
      this.editMode = true;
      this.nameFormControl.setValue(this.model.name);
      this.abbreviationFormControl.setValue(this.model.abbreviation);
    }

    this.form = new FormGroup({
      name: this.nameFormControl,
      abbreviation: this.abbreviationFormControl
    });
  }
}
