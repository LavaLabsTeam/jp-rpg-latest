import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutesautocompletePage } from './routesautocomplete';

@NgModule({
  declarations: [
    RoutesautocompletePage,
  ],
  imports: [
    IonicPageModule.forChild(RoutesautocompletePage),
  ],
  exports: [
    RoutesautocompletePage
  ]
})
export class RoutesautocompletePageModule {}
