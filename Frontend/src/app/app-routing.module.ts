import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './sites/main/main.component';
import { ChartComponent } from './sites/chart/chart.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'chart',
    component: ChartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
