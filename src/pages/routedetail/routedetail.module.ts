import { MapPageModule } from './../map/map.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutedetailPage } from './routedetail';
import { WalkingDurationPipe } from '../../pipes/walking-duration/walking-duration';

@NgModule({
  declarations: [
    RoutedetailPage,
    WalkingDurationPipe
  ],
  imports: [
    IonicPageModule.forChild(RoutedetailPage),
    MapPageModule,
  ],
  exports: [
    RoutedetailPage,
    WalkingDurationPipe
  ]
})
export class RoutedetailPageModule {}
