import { StopsnearmePageModule } from './../stopsnearme/stopsnearme.module';
import { ProgressPageModule } from './../progress/progress.module';
import { PlacesearchPageModule } from './../placesearch/placesearch.module';
import { DatepickerPageModule } from './../datepicker/datepicker.module';
import { EtaresultPageModule } from './../etaresult/etaresult.module';
import { RoutesPageModule } from './../routes/routes.module';
import { GeneralinfoPageModule } from './../generalinfo/generalinfo.module';
import { HomePage } from './home';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    HomePage
  ],
  entryComponents:[
      HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    GeneralinfoPageModule,
    RoutesPageModule,
    EtaresultPageModule,
    DatepickerPageModule,
    PlacesearchPageModule,
    ProgressPageModule,
    StopsnearmePageModule
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}