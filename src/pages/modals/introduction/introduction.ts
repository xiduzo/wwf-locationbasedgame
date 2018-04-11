import { Component } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';

import { MapPage } from '../../map/map';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../../lib/geolocation';

import { Constants } from '../../../lib/constants';

@Component({
  selector: 'introduction-modal',
  templateUrl: 'introduction.html'
})
export class IntroductionModal {

  private _structure:any;
  private _canStartGame:boolean = true;
  private _geoSubscription:any;
  private _goal:any = { longitude: 4.871422, latitude: 52.359013 };

  constructor(
    private params: NavParams,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private geolocation: Geolocation,
    private geolocationService: GeolocationService
  ) {
  }

  ionViewWillEnter() {
    this._structure = this.params.get('structure');
  }

  ionViewDidEnter() {
    this._geoSubscription = this.geolocation.watchPosition().subscribe((data) => {
      // TODO get bearing (heading) of device
      const inRange = this.geolocationService.closeToPoint(data.coords, this._goal, 25);
      if(inRange) this._canStartGame = true;
    });
  }

  closeModel() {
    this.viewCtrl.dismiss();
  }

  startGame() {
    this.navCtrl.push(MapPage, {
      triggerOnPoi: true,
      trackUserPath: (this._structure.type === 1 ? true : false),
    });

    // Stop wasting battery
    this._geoSubscription.unsubscribe();

    this.closeModel();
  }
}
