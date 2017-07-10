import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaresPage } from './fares';

@NgModule({
  declarations: [
    FaresPage,
  ],
  imports: [
    IonicPageModule.forChild(FaresPage),
  ],
  exports: [
    FaresPage
  ]
})
export class FaresPageModule {}
