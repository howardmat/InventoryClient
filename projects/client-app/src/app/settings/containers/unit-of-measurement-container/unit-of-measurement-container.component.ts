import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay, skip } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { UnitOfMeasurementFacade } from '../../facades/unit-of-measurement.facade';
import { UnitOfMeasurementListComponent } from '../../components/unit-of-measurement-list/unit-of-measurement-list.component';
import { UnitOfMeasurement } from '../../models/unit-of-measurement.model';
import { UnitOfMeasurementComponent } from '../../components/unit-of-measurement/unit-of-measurement.component';

@Component({
  selector: 'app-unit-of-measurement-container',
  templateUrl: './unit-of-measurement-container.component.html',
  styleUrls: ['./unit-of-measurement-container.component.scss']
})
export class UnitOfMeasurementContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  isUpdatingSubscription: Subscription;
  isUpdating: boolean;
  dataSubscription: Subscription;
  showForm: boolean;
  model: UnitOfMeasurement;

  @ViewChild(UnitOfMeasurementListComponent, {static: false}) uomList: UnitOfMeasurementListComponent;
  @ViewChild(UnitOfMeasurementComponent, {static: false}) uomComponent: UnitOfMeasurementComponent;

  constructor(private unitOfMeasurementFacade: UnitOfMeasurementFacade,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isUpdatingSubscription = this.unitOfMeasurementFacade.isUpdating$().subscribe(val => {
      this.isUpdating = val;
    });
    if (!this.unitOfMeasurementFacade.hasLoaded){
      this.unitOfMeasurementFacade.loadItems().subscribe();
    }

    // handle delayed errors in facade
    this.unitOfMeasurementFacade.delayedError$.subscribe(error => {
      if (error){
        this._snackBar.open(error, 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });

    // handle delayed saves in facade 
    this.unitOfMeasurementFacade.delayedSave$.pipe(
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
    this.dataSubscription = this.unitOfMeasurementFacade.getItems$()
    .pipe(
      // Using delay to defer the use of ViewChild property, uomList, until next JS turn
      delay(0)
    )
    .subscribe(data => {
      if (this.uomList && data.length) {
        this.uomList.dataSource.data = data;
      }else{
        this.uomList.dataSource.data = [];
      }
    });
  }

  onAdd() {
    this.model = new UnitOfMeasurement('', '');
    this.showForm = true;
  }

  onEdit(id: string) {
    this.model = this.unitOfMeasurementFacade.getItem(id);
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
        const unit = this.unitOfMeasurementFacade.getItem(id);
        this.unitOfMeasurementFacade.deleteItem(unit);

        this._snackBar.open('The record has been deleted!', 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    }); 
  }

  onFormSave(unitOfMeasurement: UnitOfMeasurement): void {
    if (unitOfMeasurement.id === ''){
      this.unitOfMeasurementFacade.addItem(unitOfMeasurement);
    }else{
      this.unitOfMeasurementFacade.updateItem(unitOfMeasurement);
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
