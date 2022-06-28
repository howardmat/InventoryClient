import { NgModule } from '@angular/core';
import { OverviewComponent } from './components/overview/overview.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    // routing
    DashboardRoutingModule,

    SharedModule
  ],
  declarations: [OverviewComponent]
})
export class DashboardModule { }
