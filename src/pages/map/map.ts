import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

import { Constants } from '../../lib/constants'

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../lib/geolocation';


@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {

  // Map object on which we do our magic on later
  public _map:any;

  // Should the app track your location
  private _trackUserPath:boolean = false;

  // Should the app trigger when you are at location
  private _triggerOnLocation:boolean = false;

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
  }

  ionViewWillEnter() {
    const pois = this.params.get('pois');
    const walkapath = this.params.get('walkapath');
    const trackUserPath = this.params.get('trackUserPath');
    const triggerOnPoi = this.params.get('triggerOnPoi');

    // What should we do on the map
    if(pois) this.addPointsOfInterest(pois);
    if(walkapath) this.addPath(walkapath);

    // What kind of interaction do we need
    if(walkapath) this.addPath(walkapath);
  }

  ionViewDidEnter() {
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
    });

    this._map.addControl(geolocate, 'bottom-right');

    geolocate.on('geolocate', function(e) {
      console.log(e);
    });
  }

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
    let mapZoom:number = 19;
    this._map = new mapboxgl.Map({
      style: mapStyle,
      center: [4.86, 52.356],
      zoom: mapZoom,
      minZoom: mapZoom,
      maxZoom: mapZoom,
      container: 'modalmap',
      pitch: 50
    });
  }

  addPointsOfInterest(pois) {
    pois.forEach(poi => {
        var el = document.createElement('div');
        el.className = 'poi_marker';
        new mapboxgl.Marker(el)
        .setLngLat([poi.lon, poi.lat])
        .addTo(this._map);
    });
  }

  addPath(path) {

  }

}
