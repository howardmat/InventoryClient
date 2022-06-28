import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { IdModel } from '../models/id-model.interface';
import { State } from './state.interface';

@Injectable()
export abstract class GenericState<T extends IdModel> implements State<T> {
  private updating$ = new BehaviorSubject<boolean>(false);
  private itemSubject$ = new BehaviorSubject<T[]>([]);

  isUpdating$(): Observable<boolean> {
    return this.updating$.asObservable();
  }

  setUpdating(isUpdating: boolean): void {
    this.updating$.next(isUpdating);
  }

  getItems$(): Observable<T[]> {
    return this.itemSubject$.asObservable();
  }

  getItems(): T[] {
    return this.itemSubject$.getValue();
  }

  getItem(id: string): T {
    const collection = this.itemSubject$.getValue();
    const indexOfUpdated = collection.findIndex(item => item.id === id);
    return collection[indexOfUpdated];
  }

  setItems(items: T[]): void {
    this.itemSubject$.next(items);
  }

  addItem(item: T): void {
    const currentValue = this.itemSubject$.getValue();
    this.itemSubject$.next([...currentValue, item]);
  }

  updateItem(item: T): void {
    const items = this.itemSubject$.getValue();
    const indexOfUpdated = items.findIndex(i => i.id === item.id);
    items[indexOfUpdated] = item;
    this.itemSubject$.next([...items]);
  }

  updateItemId(itemToReplace: T, addedItemWithId: T): void {
    const items = this.itemSubject$.getValue();
    const updatedItemIndex = items.findIndex(i => i === itemToReplace);
    items[updatedItemIndex] = addedItemWithId;
    this.itemSubject$.next([...items]);
  }

  removeItem(item: T): void {
    const currentValue = this.itemSubject$.getValue();
    this.itemSubject$.next(currentValue.filter(i => i !== item));
  }
}