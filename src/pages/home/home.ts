import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { IntroductionModal } from '../modals/introduction/introduction';

import { SoundTest } from '../tests/sound/sound';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public _narrativeStructures:any = [
    {
      type: 1,
      name: 'Linear'
    },
    {
      type: 2,
      name: 'Free roam'
    },
    {
      type: 3,
      name: 'test'
    }
  ]

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
  }

  selectNarrativeStructure(structure:any) {
    if(structure.type === 3) {
      this.navCtrl.push(SoundTest);
    } else {
      let introductionModal = this.modalCtrl.create(IntroductionModal, { structure: structure });
      introductionModal.present();
    }
  }

}
