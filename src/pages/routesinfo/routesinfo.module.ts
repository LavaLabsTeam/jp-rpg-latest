import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutesinfoPage } from './routesinfo';

@NgModule({
  declarations: [
    RoutesinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(RoutesinfoPage),
  ],
  exports: [
    RoutesinfoPage
  ]
})
export class RoutesinfoPageModule {}
