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
    }, 100);
  }

  closeModel() {
    this.viewCtrl.dismiss();
  }

  startGame() {
    this.navCtrl.push(MapPage, {
      pois: [
        {
          id: 'headmaster',
          coords: { longitude: 4.871422, latitude: 52.359013, },
          active: true,
          markerLabel: 'dome',
          narrativeFile: 'headmaster.json',
          pathToNextPoi: [
            // longitude , latitude
            [4.87164421153102, 52.3588933388493],
            [4.87177027535472, 52.35883436861129],
            [4.871590567350722, 52.3587262563039],
            [4.871311617613173, 52.35869185687793],
            [4.87113995623622, 52.35871806596683],
            [4.870850277662612, 52.35888842466581],
          ],
          poisToActivate: ['frog'],
          range: 25
        },
        {
          id: 'frog',
          coords: {longitude: 4.869514537523514, latitude: 52.3578613483531},
          active: false,
          markerLabel: 'frog',
          narrativeFile: 'frog.json',
          pathToNextPoi: [
            // longitude , latitude
          ],
          poisToActivate: ['search'],
          range: 10
        },
        {
          id: 'search',
          coords: {longitude: 4.869042468736893, latitude: 52.3578613483531},
          active: false,
          markerLabel: 'search',
          narrativeFile: 'search.json',
          pathToNextPoi: [
            // longitude , latitude
          ],
          poisToActivate: ['statue'],
          range: 20
        },
        {
          id: 'statue',
          coords: {longitude: 4.868012500475174, latitude: 52.35744435437407},
          active: false,
          markerLabel: 'statue',
          narrativeFile: 'statue.json',
          pathToNextPoi: [
            // longitude , latitude
          ],
          poisToActivate: ['stones'],
          range: 30
        },
        {
          id: 'stones',
          coords: {longitude: 4.865609241197831, latitude: 52.358185674283185},
          active: false,
          markerLabel: 'stones',
          narrativeFile: 'stones.json',
          pathToNextPoi: [
            // longitude , latitude
          ],
          poisToActivate: ['hexagons'],
          range: 10
        },
        {
          id: 'hexagons',
          coords: {longitude: 4.864294958780533, latitude: 52.35773625057266},
          active: false,
          markerLabel: 'hexagons',
          narrativeFile: 'hexagons.json',
          pathToNextPoi: [
            // longitude , latitude
          ],
          poisToActivate: ['frog'],
          range: 5
        },
        {
          id: 'castle',
          coords: {longitude: 4.862535429666764, latitude: 52.35678642253879},
          active: false,
          markerLabel: 'castle',
          narrativeFile: 'castle.json',
          range: 5
        },
      ],
      triggerOnPoi: true,
      trackUserPath: (this._structure.type === 1 ? true : false),
    });

    this.closeModel();
  }
}
