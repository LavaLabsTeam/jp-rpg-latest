import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacesearchPage } from './placesearch';

@NgModule({
  declarations: [
    PlacesearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacesearchPage),
  ],
  exports: [
    PlacesearchPage
  ]
})
export class PlacesearchPageModule {}
