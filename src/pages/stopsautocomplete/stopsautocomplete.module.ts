import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StopsautocompletePage } from './stopsautocomplete';

@NgModule({
  declarations: [
    StopsautocompletePage,
  ],
  imports: [
    IonicPageModule.forChild(StopsautocompletePage),
  ],
  exports: [
    StopsautocompletePage
  ]
})
export class StopsautocompletePageModule {}
