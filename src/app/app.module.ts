import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PlacesearchPage } from '../pages/placesearch/placesearch';
import { RoutesPage } from '../pages/routes/routes';
import { EtaresultPage } from '../pages/etaresult/etaresult';
import { StopsnearmePage } from '../pages/stopsnearme/stopsnearme';

import { HighlightDirective } from '../directives/highlight.directive';
import { GoogleplaceDirective } from '../directives/googleplace.directive';
import { GeneralinfoPage } from '../pages/generalinfo/generalinfo';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RoutesPage,
    EtaresultPage,
    PlacesearchPage,
    StopsnearmePage,
    HighlightDirective,
    GoogleplaceDirective,
    GeneralinfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EtaresultPage,
    PlacesearchPage,
    RoutesPage,
    StopsnearmePage,
    GeneralinfoPage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
