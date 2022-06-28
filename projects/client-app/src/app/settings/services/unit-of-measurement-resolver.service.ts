import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UnitOfMeasurementFacade } from '../facades/unit-of-measurement.facade';
import { UnitOfMeasurement } from '../models/unit-of-measurement.model';

@Injectable()
export class UnitOfMeasurementResolverService implements Resolve<UnitOfMeasurement[]> {

  constructor(private unitOfMeasurementFacade: UnitOfMeasurementFacade) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const unitOfMeasurements = this.unitOfMeasurementFacade.getItems();
    if (unitOfMeasurements.length === 0){
      return this.unitOfMeasurementFacade.loadItems();
    }
    return unitOfMeasurements;
  }
}