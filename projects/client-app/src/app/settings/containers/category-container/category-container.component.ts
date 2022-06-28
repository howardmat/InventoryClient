import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { CategoryComponent } from '../../components/category/category.component';
import { CategoryFacade } from '../../facades/category.facade';
import { Category } from '../../models/category.model';
import { delay, skip } from 'rxjs/operators';



@Component({
  selector: 'app-category-container',
  templateUrl: './category-container.component.html',
  styleUrls: ['./category-container.component.scss']
})
export class CategoryContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  isUpdatingSubscription: Subscription;
  isUpdating: boolean;
  dataSubscription: Subscription;
  showForm: boolean;
  model: Category;

  @ViewChild(CategoryListComponent, {static: false}) categoryList: CategoryListComponent;
  @ViewChild(CategoryComponent, {static: false}) categoryComponent: CategoryComponent;

  constructor(private categoryFacade: CategoryFacade,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isUpdatingSubscription = this.categoryFacade.isUpdating$().subscribe(val => {
      this.isUpdating = val;
    });
    if (!this.categoryFacade.hasLoaded){
      this.categoryFacade.loadItems().subscribe();
    }

    // handle delayed errors in facade
    this.categoryFacade.delayedError$.subscribe(error => {
      if (error){
        this._snackBar.open(error, 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });

    // handle delayed saves in facade 
    this.categoryFacade.delayedSave$.pipe(
      skip(1)
    ).subscribe(saved => {
      if (saved){
        this._snackBar.open('The record has been saved!', 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSubscription = this.categoryFacade.getItems$()
    .pipe(
      // Using delay to defer the use of ViewChild property, uomList, until next JS turn
      delay(0)
    )
    .subscribe(data => {
      if (this.categoryList && data.length) {
        this.categoryList.dataSource.data = data;
      }else{
        this.categoryList.dataSource.data = [];
      }
    });
  }

  onAdd() {
    this.model = new Category('', '');
    this.showForm = true;
  }

  onEdit(id: string) {
    this.model = this.categoryFacade.getItem(id);
    this.showForm = true;
  }

  onDelete(id: string) {
   Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        const unit = this.categoryFacade.getItem(id);
        this.categoryFacade.deleteItem(unit);

        this._snackBar.open('The record has been deleted!', 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    }); 
  }

  onFormSave(category: Category): void {
    if (category.id === ''){
      this.categoryFacade.addItem(category);
    }else{
      this.categoryFacade.updateItem(category);
    }
    this.showForm = false;
  }

  onFormCancel(): void {
    this.showForm = false;
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.isUpdatingSubscription.unsubscribe();
  }

}
