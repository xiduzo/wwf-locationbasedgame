import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

import { WalkAPathGame } from '../../../pages/games/walkapath/walkapath'
import { MakeAPictureGame } from '../../../pages/games/makeapicture/makeapicture'

@Component({
  selector: 'introduction-model',
  templateUrl: 'introduction.html'
})
export class IntroductionModel {

  public _poi:any;
  public _coords:any;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    public modalCtrl: ModalController
  ) {
  }

  ionViewWillEnter() {
    this._poi = this.params.get('poi');
    this._coords = this.params.get('coords');
  }

  closeModel() {
    this.viewCtrl.dismiss(true);
  }

  startGame() {
    let game;
    switch(this._poi.game) {
      case('walkapath'):
        game = WalkAPathGame;
        break;
      case('makepicture'):
        game = MakeAPictureGame;
        break;
    }
    const model = this.modalCtrl.create(game, {coords: this._coords});
    model.present();
    this.viewCtrl.dismiss(false);
  }
}
