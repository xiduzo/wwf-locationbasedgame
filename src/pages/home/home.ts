import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { IntroductionModal } from '../modals/introduction/introduction';

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
    }
  ]

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
  }

  selectNarrativeStructure(structure:any) {
    let introductionModal = this.modalCtrl.create(IntroductionModal, { structure: structure });
    introductionModal.present();
  }

}
