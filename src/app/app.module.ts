import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PlacesearchPage } from '../pages/placesearch/placesearch';
import { HighlightDirective } from '../directives/highlight.directive';
import { GoogleplaceDirective } from '../directives/googleplace.directive';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlacesearchPage,
    HighlightDirective,
    GoogleplaceDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlacesearchPage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
