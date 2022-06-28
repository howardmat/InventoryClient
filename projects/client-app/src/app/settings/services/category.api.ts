import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Category } from '../models/category.model';
import { GenericApi } from 'projects/client-app/src/services/generic.api';
import { environment } from '../../../environments/environment';

@Injectable()
export class CategoryApi extends GenericApi<Category> {
  readonly Api: string =
    environment.firebase.dataUrl._base +
    environment.firebase.dataUrl.category;

    constructor(protected http: HttpClient) { 
      super(http);
    }
}
