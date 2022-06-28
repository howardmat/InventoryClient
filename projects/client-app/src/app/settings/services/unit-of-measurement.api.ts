import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UnitOfMeasurement } from '../models/unit-of-measurement.model';
import { GenericApi } from 'projects/client-app/src/services/generic.api';
import { environment } from '../../../environments/environment';

@Injectable()
export class UnitOfMeasurementApi extends GenericApi<UnitOfMeasurement> {
  readonly Api = environment.firebase.dataUrl._base +
    environment.firebase.dataUrl.unitOfMeasurement;

    constructor(protected http: HttpClient) { 
      super(http);
    }
}
