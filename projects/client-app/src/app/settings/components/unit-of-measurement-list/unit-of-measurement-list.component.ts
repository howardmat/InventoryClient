import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { UnitOfMeasurement } from '../../models/unit-of-measurement.model';

@Component({
  selector: 'app-unit-of-measurement-list',
  templateUrl: './unit-of-measurement-list.component.html',
  styleUrls: ['./unit-of-measurement-list.component.scss']
})
export class UnitOfMeasurementListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'abbreviation', 'action'];
  dataSource = new MatTableDataSource<UnitOfMeasurement>();

  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(id: string): void {
    this.delete.next(id);
  }

  onAdd(): void {
    this.add.next();
  }

  onEdit(id: string): void {
    this.edit.next(id);
  }
}
