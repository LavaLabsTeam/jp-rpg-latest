import { MapPageModule } from './../map/map.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutedetailPage } from './routedetail';

@NgModule({
  declarations: [
    RoutedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RoutedetailPage),
    MapPageModule
  ],
  exports: [
    RoutedetailPage
  ]
})
export class RoutedetailPageModule {}
