import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'riddle-game',
  templateUrl: 'riddle.html'
})
export class RiddleGame {

  public _state:number = 0;
  public _answer:string;

  constructor(
    private viewCtrl: ViewController
  ) {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  validatePassword() {
    if(this._answer === 'vogelhuisje') {
      this._state = 2;
    }
  }
}
