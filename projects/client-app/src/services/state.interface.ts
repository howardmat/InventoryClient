import { Observable } from 'rxjs';

export interface State<T> {
  isUpdating$(): Observable<boolean>;
  setUpdating(isUpdating: boolean): void;
  
  getItems$(): Observable<T[]>;
  getItems(): T[];
  getItem(id: string): T;
  setItems(items: T[]): void;
  addItem(item: T): void;
  updateItem(item: T): void;
  updateItemId(itemToReplace: T, addedItemWithId: T): void;
  removeItem(item: T): void;
}