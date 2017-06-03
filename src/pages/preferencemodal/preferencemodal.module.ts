import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreferencemodalPage } from './preferencemodal';

@NgModule({
  declarations: [
    PreferencemodalPage,
  ],
  imports: [
    IonicPageModule.forChild(PreferencemodalPage),
  ],
  exports: [
    PreferencemodalPage
  ]
})
export class PreferencemodalPageModule {}
