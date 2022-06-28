import { IdModel } from 'projects/client-app/src/models/id-model.interface';

export class Category implements IdModel {
  id: string;
  name: string;
  categoryType: string;

  constructor(name: string, categoryType: string, id: string = '') {
    this.id = id;
    this.name = name;
    this.categoryType = categoryType;
  }
}
