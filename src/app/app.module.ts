// Core
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// (native) plugins
import { Geolocation } from '@ionic-native/geolocation';
import { BLE } from '@ionic-native/ble';
import { Camera } from '@ionic-native/camera';
import { NativeAudio } from '@ionic-native/native-audio';

// Pages
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

// Models
import { IntroductionModel } from '../pages/models/introduction/introduction';
import { MapModel } from '../pages/models/map/map';
import { NarrativeModel } from '../pages/models/narrative/narrative';

// Games
import { WalkAPathGame } from '../pages/games/walkapath/walkapath';
import { MakeAPictureGame } from '../pages/games/makeapicture/makeapicture';

// Services
import { GeolocationService } from '../lib/geolocation';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    IntroductionModel,
    MapModel,
    NarrativeModel,
    WalkAPathGame,
    MakeAPictureGame
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    IntroductionModel,
    MapModel,
    NarrativeModel,
    WalkAPathGame,
    MakeAPictureGame
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BLE,
    Camera,
    GeolocationService,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
