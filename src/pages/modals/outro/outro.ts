import { Component } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'outro-modal',
  templateUrl: 'outro.html'
})
export class OutroModal {

  constructor(
    private params: NavParams,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
  ) {
  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {

  }

  closeModel() {
    this.viewCtrl.dismiss();
  }

  startGame() {

    this.closeModel();
  }
}
