import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, ModalController } from 'ionic-angular';

import { MapPage } from '../../map/map';

@Component({
  selector: 'introduction-modal',
  templateUrl: 'introduction.html'
})
export class IntroductionModal {

  private _structure:any;
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
        {
          lon:4.871422,
          lat: 52.359013,
          active: true,
          activeBackground: true,
          initialPoi: true,
          marker: 'marker',
          narrativeFile: 'headmaster.json'
        }
      ],
      triggerOnPoi: true,
      trackUserPath: (this._structure.type === 1 ? true : false),
      pathToTrack: [
        // longitude , latitude
        [4.87164421153102, 52.3588933388493],
        [4.87177027535472, 52.35883436861129],
        [4.871590567350722, 52.3587262563039],
        [4.871311617613173, 52.35869185687793],
        [4.87113995623622, 52.35871806596683],
        [4.870850277662612, 52.35888842466581],
      ]
    });

    this.closeModel();
  }
}
