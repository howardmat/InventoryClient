import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './containers/settings/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

import { UnitOfMeasurementContainerComponent } from './containers/unit-of-measurement-container/unit-of-measurement-container.component';
import { UnitOfMeasurementComponent } from './components/unit-of-measurement/unit-of-measurement.component';
import { UnitOfMeasurementListComponent } from './components/unit-of-measurement-list/unit-of-measurement-list.component';
import { UnitOfMeasurementFacade } from './facades/unit-of-measurement.facade';
import { UnitOfMeasurementState } from './state/unit-of-measurement.state';
import { UnitOfMeasurementApi } from './services/unit-of-measurement.api';

import { CategoryComponent } from './components/category/category.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryContainerComponent } from './containers/category-container/category-container.component';
import { CategoryApi } from './services/category.api';
import { CategoryFacade } from './facades/category.facade';
import { CategoryState } from './state/category.state';

@NgModule({
  declarations: [
    SettingsComponent,
    UnitOfMeasurementComponent,
    UnitOfMeasurementListComponent,
    CategoryComponent,
    CategoryListComponent,
    UnitOfMeasurementContainerComponent,
    CategoryContainerComponent
  ],
  imports: [
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ReactiveFormsModule,
    SettingsRoutingModule
  ],
  providers: [
    UnitOfMeasurementApi,
    UnitOfMeasurementFacade,
    UnitOfMeasurementState,
    CategoryApi,
    CategoryFacade,
    CategoryState
  ]
})
export class SettingsModule {}
