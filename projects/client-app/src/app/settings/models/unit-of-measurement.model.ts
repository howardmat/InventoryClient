import { IdModel } from 'projects/client-app/src/models/id-model.interface';

export class UnitOfMeasurement implements IdModel {
  id: string;
  name: string;
  abbreviation: string;

  constructor(name: string, abbreviation: string, id: string = '') {
    this.id = id;
    this.name = name;
    this.abbreviation = abbreviation;
  }
}