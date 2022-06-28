import { Injectable } from "@angular/core";
import { Category } from '../models/category.model';
import { GenericState } from '../../../services/generic.state';

@Injectable()
export class CategoryState extends GenericState<Category> {
  
}