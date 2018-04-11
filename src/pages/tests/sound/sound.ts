import { Component } from '@angular/core';

import { NativeAudio } from '@ionic-native/native-audio';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../../lib/geolocation';

@Component({
  selector: 'sound-test',
  templateUrl: 'sound.html'
})
export class SoundTest {

  private _soundFile = '../../../assets/sounds/frog.mp3';
  private _goal = { latitude: 52.346669, longitude: 4.918135}; // Amstel station
  private _range:number = 0;

  constructor(
    private nativeAudio: NativeAudio,
    private geolocation: Geolocation,
    private geolocationService: GeolocationService
  ) {

  }

  ngOnInit() {
    for(let i = 0; i <= 10; i++) {
      this.nativeAudio.preloadComplex((10*i + '%'), this._soundFile, (0.1 * i), 1, 0);
    }
  }

  ionViewDidEnter() {
    this.checkRange();
    // console.log(true);
    // this.geolocation.watchPosition()
    // // .filter((p) => p.coords !== undefined) //Filter Out Errors
    // .subscribe(position => {
    //   console.log(true);
    //   this.checkRange(position);
    // });
  }

  checkRange() {
    console.log(true);
    this.geolocation.getCurrentPosition().then((resp) => {
      this._range = this.geolocationService.distanceToPoint(resp.coords, this._goal) * 1000;

      let noiseLevel = parseFloat((this._range * 1000 / 100).toFixed(1));
      noiseLevel = noiseLevel > 1 ? 1 : noiseLevel;
      noiseLevel = 100 - noiseLevel * 100;
      console.log(noiseLevel);
      this.nativeAudio.play(noiseLevel + '%');

      setTimeout(() => {
        this.checkRange();
      }, 1000)
    });
    // console.log((100 - noise * 100));
  }
}
