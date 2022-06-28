import { Observable } from 'rxjs';

export interface Api<T> {
  getItems(): Observable<T[]>;
  createItem(item: T) : Observable<any>;
  updateItem(item: T) : Observable<any>;
  deleteItem(item: T) : Observable<any>;
}