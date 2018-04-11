// Core
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule, HttpClient } from '@angular/common/http';

// (native) plugins
import { Geolocation } from '@ionic-native/geolocation';
import { BLE } from '@ionic-native/ble';
import { Camera } from '@ionic-native/camera';
import { NativeAudio } from '@ionic-native/native-audio';

// Pages
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';

// Models
import { IntroductionModal } from '../pages/modals/introduction/introduction';
import { NarrativeModal } from '../pages/modals/narrative/narrative';

// Games
import { WalkAPathGame } from '../pages/games/walkapath/walkapath';
import { MakeAPictureGame } from '../pages/games/makeapicture/makeapicture';
import { QuestionsGame } from '../pages/games/questions/questions';

// Services
import { GeolocationService } from '../lib/geolocation';

// Testing
import { SoundTest } from '../pages/tests/sound/sound';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    IntroductionModal,
    NarrativeModal,
    WalkAPathGame,
    MakeAPictureGame,
    QuestionsGame,
    SoundTest
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    IntroductionModal,
    NarrativeModal,
    WalkAPathGame,
    MakeAPictureGame,
    QuestionsGame,
    SoundTest
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BLE,
    Camera,
    GeolocationService,
    NativeAudio,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
