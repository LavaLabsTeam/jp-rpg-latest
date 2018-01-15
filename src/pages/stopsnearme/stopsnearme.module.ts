import { RoundPipe } from './../../pipes/round/round';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StopsnearmePage } from './stopsnearme';

@NgModule({
  declarations: [
    StopsnearmePage,
  ],
  imports: [
    IonicPageModule.forChild(StopsnearmePage),
  ],
  exports: [
    StopsnearmePage
  ],
  providers:[
    RoundPipe
  ]
})
export class StopsnearmePageModule {}
