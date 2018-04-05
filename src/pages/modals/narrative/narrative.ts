import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'narrative-modal',
  templateUrl: 'narrative.html'
})
export class NarrativeModal {

  public _narrative:any;
  public _buttonAvailable:boolean = false;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private params: NavParams,
    private http: HttpClient
  ) {

  }

  ionViewWillEnter() {
    this.getJSON(this.params.get('narrativeFile')).subscribe(data => {
      this._narrative = data;
      this.pushLineToNarrative(this._narrative.narrative[this._narrative.linesSpoken.length]);
    });
  }

  getJSON(file): Observable<any> {
    return this.http.get("./assets/narratives/"+file);
  }

  pushLineToNarrative(line) {
    this._narrative.linesSpoken.push(line);
    if(this._narrative.narrative.length !== this._narrative.linesSpoken.length) {
      // TODO
      // When narrator is done talking, show next line
      setTimeout(() => {
        this.pushLineToNarrative(this._narrative.narrative[this._narrative.linesSpoken.length]);
      }, 4 * line.length)
    } else {
      this._buttonAvailable = true;
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
