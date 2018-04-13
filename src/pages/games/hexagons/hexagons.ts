import { Component } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../../lib/geolocation';

@Component({
  selector: 'hexagons-game',
  templateUrl: 'hexagons.html'
})
export class HexagonsGame {

  private _treassureLocation:any = {
    latitude: 52.35768740921204,
    longitude: 4.863516725329873
  };
  public _state:number = 0;
  public _canReadDirections:boolean = true;
  private _watch:any;

  constructor(
    private geolocation: Geolocation,
    private geolocationService: GeolocationService,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidEnter() {
    this._watch = this.geolocation.watchPosition().subscribe((position) => {
      let coords = {longitude: 4.864294958780533, latitude: 52.35773625057266};
      let closeToBase = this.geolocationService.closeToPoint(position.coords, coords, 10);

      this._canReadDirections = closeToBase ? true : false;
      this.validateLocation(position);
    });
  }

  ionViewWillDissapear() {
    // this._watch.unsubscribe();
  }

  validateLocation(position) {
    let closeToTreassure = this.geolocationService.closeToPoint(position.coords, this._treassureLocation, 5);

    if(closeToTreassure) this._state = 2
  }
}
