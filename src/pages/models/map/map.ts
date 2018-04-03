import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

import { Constants } from '../../../lib/constants'

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../../lib/geolocation';


@Component({
  selector: 'map-model',
  templateUrl: 'map.html'
})
export class MapModel {

  // Core for any map
  public _map:any;
  public _locationMarker:any;
  private UPDATE_GPS_LOCATION:any;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private params: NavParams,
    private geolocation: Geolocation,
    private geolocationService: GeolocationService
  ) {
  }

  ngOnInit() {
    this.displayMap();

    if(this.params.get('pois')) {
      this.addPointsOfInterest(this.params.get('poi'));
    }

    if(this.params.get('walkapath')) {
      this.addPath(this.params.get('walkapath'));
    }
  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {
  }

  closeModel() { this.viewCtrl.dismiss(true); }

  displayMap() {
    mapboxgl.accessToken = Constants.ACCESS_TOKEN;
    let mapStyle:any = Constants.MAP_STYLE;
    mapStyle.sources.overlay = {
      type: "image",
      url: "",
      // url: "http://localhost:8100/assets/imgs/maps/vondel.png",
      coordinates: [
        [4.85530151200328, 52.36360251297369],[4.882552755594588, 52.36360251297369],
        [4.882552755594588, 52.35187368967347],[4.85530151200328, 52.35187368967347]
      ]
    };
    this._map = new mapboxgl.Map({
      style: mapStyle,
      center: [4.86, 52.356],
      zoom: 18,
      minZoom: 18,
      maxZoom: 18,
      container: 'modalmap'
    });

    this._map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
    }), 'bottom-right');

    this._map.on('geolocate', (data) => {
      console.log(data);
    });
  }

  addPointsOfInterest(pois) {
    pois.forEach(poi => {
        var el = document.createElement('div');
        el.className = 'flag_marker';
        new mapboxgl.Marker(el)
        .setLngLat([poi.lon, poi.lat])
        .addTo(this._map);
    });
  }

  addPath(path) {

  }

}
