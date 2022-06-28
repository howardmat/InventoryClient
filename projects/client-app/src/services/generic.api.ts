import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdModel } from '../models/id-model.interface';
import { Api } from './api.interface';

export abstract class GenericApi<T extends IdModel> implements Api<T> {
  protected Api: string;

  constructor(protected http: HttpClient) { }

  checkApiIsSet() {
    if (!this.Api){
      throw new SyntaxError('API property has not been initialized');
    }
  }

  getItems(): Observable<T[]> {
    this.checkApiIsSet();
    return this.http.get<T[]>(`${this.Api}.json`);
  }

  createItem(item: T) : Observable<any> {
    this.checkApiIsSet();
    return this.http.post(`${this.Api}.json`, item);
  }

  updateItem(item: T) : Observable<any> {
    this.checkApiIsSet();
    return this.http.put(`${this.Api}/${item.id}.json`, item);
  }

  deleteItem(item: T) : Observable<any> {
    this.checkApiIsSet();
    return this.http.delete(`${this.Api}/${item.id}.json`);
  }
}