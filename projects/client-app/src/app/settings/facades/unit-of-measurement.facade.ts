import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { GenericFacade } from 'projects/client-app/src/facades/generic.facade';

import { UnitOfMeasurement } from '../models/unit-of-measurement.model';
import { UnitOfMeasurementApi } from '../services/unit-of-measurement.api';
import { UnitOfMeasurementState } from '../state/unit-of-measurement.state';

@Injectable()
export class UnitOfMeasurementFacade extends GenericFacade<UnitOfMeasurement> {
  constructor(api: UnitOfMeasurementApi, state: UnitOfMeasurementState) {
    super(api, state);
  }

  loadItems(): Observable<UnitOfMeasurement[]> {
    this.state.setUpdating(true);

    return this.api.getItems().pipe(
      map(items => {
        var itemArray: UnitOfMeasurement[] = [];
        for (var key in items) {
          itemArray.push(
            new UnitOfMeasurement(
              items[key].name,
              items[key].abbreviation,
              key
            )
          );
        }
        return itemArray;
      }),
      tap(items => {
        this.state.setItems(items);
        this.state.setUpdating(false);
        this.hasLoaded = true;
      })
    );
  }
}
