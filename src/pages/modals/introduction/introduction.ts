import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, ModalController } from 'ionic-angular';

import { MapPage } from '../../map/map';

@Component({
  selector: 'introduction-modal',
  templateUrl: 'introduction.html'
})
export class IntroductionModal {

  private _structure:string;
  private _canStartGame:boolean = false;

  constructor(
    private params: NavParams,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {
  }

  ionViewWillEnter() {
    this._structure = this.params.get('structure');
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this._canStartGame = true;
    }, 300);
  }

  closeModel() {
    this.viewCtrl.dismiss();
  }

  startGame() {
    this.navCtrl.push(MapPage, {
      pois: [
        {lon: 4.8562778360847005 ,lat: 52.35585790743134 }
      ],
      triggerOnPoi: false,
      trackUserPath: false
    });

    this.closeModel();
  }
}
