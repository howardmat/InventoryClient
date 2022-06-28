import { Injectable } from "@angular/core";
import { UnitOfMeasurement } from '../models/unit-of-measurement.model';
import { GenericState } from '../../../services/generic.state';

@Injectable()
export class UnitOfMeasurementState extends GenericState<UnitOfMeasurement> {
  
}