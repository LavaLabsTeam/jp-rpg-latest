import { HighlightDirective } from './../../directives/highlight.directive';
import { FocuserDirective } from './../../directives/focuser/focuser';
import { GoogleplaceDirective } from './../../directives/googleplace.directive';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacesearchPage } from './placesearch';

@NgModule({
  declarations: [
    PlacesearchPage,
    GoogleplaceDirective,
    FocuserDirective,
    HighlightDirective
  ],
  imports: [
    IonicPageModule.forChild(PlacesearchPage),
  ],
  exports: [
    PlacesearchPage
  ]
})
export class PlacesearchPageModule {}
