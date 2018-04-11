import { Component } from '@angular/core';
import { NavParams,  ViewController, ModalController } from 'ionic-angular';

import { Constants } from '../../../lib/constants';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { Geolocation } from '@ionic-native/geolocation';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { QuestionsGame } from '../../games/questions/questions';

@Component({
  selector: 'narrative-modal',
  templateUrl: 'narrative.html'
})
export class NarrativeModal {

  public _narrative:any;
  public _buttonAvailable:boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private params: NavParams,
    private http: HttpClient,
    private geolocation: Geolocation
  ) {

  }

  ionViewWillEnter() {
    this.getJSON(this.params.get('narrativeFile')).subscribe(data => {
      this._narrative = data;
    });
  }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((data) => {
      this.displayMap(data.coords);
    });
  }

  displayMap(center) {
    mapboxgl.accessToken = Constants.ACCESS_TOKEN;
    let mapStyle:any = Constants.MAP_STYLE;
    const mapZoom:number = 18;
    mapStyle.sources.overlay = {
      type: "image",
      url: "",
      // url: "http://localhost:8100/assets/imgs/maps/vondel.png",
      coordinates: [
        [4.85530151200328, 52.36360251297369],[4.882552755594588, 52.36360251297369],
        [4.882552755594588, 52.35187368967347],[4.85530151200328, 52.35187368967347]
      ]
    };

    new mapboxgl.Map({
      style: mapStyle,
      center: [center.longitude, center.latitude],
      zoom: mapZoom,
      minZoom: mapZoom,
      maxZoom: mapZoom,
      container: 'narrativemap',
    });
  }

  getJSON(file): Observable<any> {
    return this.http.get("./assets/narratives/"+file);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  startGame() {
    let modal;
    switch(this._narrative.game) {
      case 'questions':
        modal = this.modalCtrl.create(QuestionsGame, { narrative: this._narrative});
    }

    this.closeModal();
    if(modal) modal.present();
  }
}
