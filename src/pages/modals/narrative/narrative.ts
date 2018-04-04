import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

@Component({
  selector: 'narrative-modal',
  templateUrl: 'narrative.html'
})
export class NarrativeModal {

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private params: NavParams
  ) {
  }

  ionViewWillEnter() {

  }

  closeModel() {
    this.viewCtrl.dismiss(true);
  }
}
