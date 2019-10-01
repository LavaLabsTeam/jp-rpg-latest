import { HomePageModule } from './../pages/home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';

import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Constants } from '../services/constants';
import { Network } from '@ionic-native/network';
import { SortObjectPipe } from '../pipes/sort-object/sort-object';
import { RoundPipe } from '../pipes/round/round';
import { UtilProvider } from '../providers/util/util';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@NgModule({
  declarations: [
    MyApp,
    SortObjectPipe,
    RoundPipe,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AndroidPermissions,
    Network,
    DatePipe,
    RoundPipe,
    Constants,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UtilProvider
  ]
})
export class AppModule {}
