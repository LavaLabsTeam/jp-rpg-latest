import { RoutedetailPageModule } from './../routedetail/routedetail.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutesPage } from './routes';

@NgModule({
  declarations: [
    RoutesPage,
  ],
  imports: [
    IonicPageModule.forChild(RoutesPage),
    RoutedetailPageModule
  ],
  exports: [
    RoutesPage
  ]
})
export class RoutesPageModule {}
