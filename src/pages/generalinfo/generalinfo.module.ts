import { RoutesinfoPageModule } from './../routesinfo/routesinfo.module';
import { SchedulesPageModule } from './../schedules/schedules.module';
import { FaresPageModule } from './../fares/fares.module';
import { RoutesinfoPage } from './../routesinfo/routesinfo';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralinfoPage } from './generalinfo';

@NgModule({
  declarations: [
    GeneralinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralinfoPage),
    RoutesinfoPageModule,
    FaresPageModule,
    SchedulesPageModule
  ],
  entryComponents: [ 
    GeneralinfoPage 
  ],
  exports: [
    GeneralinfoPage
  ]
})
export class GeneralinfoPageModule {}
