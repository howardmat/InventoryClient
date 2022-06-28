import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { GenericFacade } from 'projects/client-app/src/facades/generic.facade';
import { Category } from '../models/category.model';
import { CategoryApi } from '../services/category.api';
import { CategoryState } from '../state/category.state';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryFacade extends GenericFacade<Category> {
  constructor(api: CategoryApi, state: CategoryState) {
    super(api, state);
  }

  loadItems(): Observable<Category[]> {
    this.state.setUpdating(true);

    return this.api.getItems().pipe(
      map(items => {
        var itemArray: Category[] = [];
        for (var key in items) {
          itemArray.push(
            new Category(
              items[key].name,
              items[key].categoryType,
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
