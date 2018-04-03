import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

@Component({
  selector: 'narrative-model',
  templateUrl: 'narrative.html'
})
export class NarrativeModel {

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
