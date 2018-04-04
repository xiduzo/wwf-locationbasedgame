import { Component } from '@angular/core';
import { NavParams, ModalController,  ViewController } from 'ionic-angular';

import { Constants } from '../../lib/constants'

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../lib/geolocation';

import { NarrativeModal } from '../modals/narrative/narrative';


@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {

  // Map object on which we do our magic on later
  public _map:any;

  // Does the user needs to follow a trail
  private _trackUserPath:boolean = false;
  private _pathToTrack:any = {
    type: 'FeatureCollection',
    features: [{type: 'Feature', geometry: {type: 'LineString',coordinates: []}}]
  };
  private _walkedPath:any = {
    type: 'FeatureCollection',
    features: [{type: 'Feature', geometry: {type: 'LineString',coordinates: []}}]
  };

  // Should the app trigger when you are at location
  private _triggerOnPoi:boolean = false;
  private _pois:any;

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
    this.addControlsToMap();
  }

  ionViewWillEnter() {
    this._pois = this.params.get('pois');

    this._trackUserPath = this.params.get('trackUserPath') ? true : false;
    this._triggerOnPoi = this.params.get('triggerOnPoi') ? true : false;
    this._pathToTrack.features[0].geometry.coordinates = this.params.get('pathToTrack') ? this.params.get('pathToTrack') : [];

    // Add pois to map
    if(this._pois) this.addPointsOfInterest(this._pois);
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
    })
    .once('styledata', () => {
      if(!this._map.getSource('pathToTrack')) this.addPathToMap("pathToTrack", this._pathToTrack, '#9E9E9E');
      if(!this._map.getSource('walkedPath')) this.addPathToMap("walkedPath", this._walkedPath, '#03A9F4');
    });
  }

  addControlsToMap() {
    const vm = this; // Need this bc 'this' will be overwritten in the 'geolocate' event
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
    })
    .on('geolocate', (e) => {
      if(vm._trackUserPath) vm.updatePathOnMap(e.coords);
      if(vm._triggerOnPoi) vm.checkPoiRange(e.coords);
    });

    this._map.addControl(geolocate, 'bottom-right');
  }

  addPointsOfInterest(pois) {
    pois.forEach(poi => {
      var el = document.createElement('div');
      el.className = 'poi__'+poi.marker;
      new mapboxgl.Marker(el)
      .setLngLat([poi.lon, poi.lat])
      .addTo(this._map);
    });
  }

  addPathToMap(id, path, color) {
    this._map.addSource(id, { type: 'geojson', data: path });
    this._map.addLayer({
      id: id,
      source: id,
      type: "line",
      "paint": { "line-color": color, "line-width": 8 }
    });
  }

  updatePathOnMap(coords) {
    this._walkedPath.features[0].geometry.coordinates.push([coords.longitude, coords.latitude]);

    // Update the walked path
    if(this._map.getSource('walkedPath')) this._map.getSource('walkedPath').setData(this._walkedPath);
  }

  checkPoiRange(coords) {
    this._pois.forEach(poi => {

        let closeToPoint = this.geolocationService.closeToPoint(
          coords,
          {latitude: poi.lat, longitude: poi.lon},
          25
        );

        if(closeToPoint && poi.active) {
          poi.active = !poi.active;
          let modal = this.modalCtrl.create(NarrativeModal, {narrativeFile: poi.narrativeFile});
          modal.present();
          modal.onDidDismiss(() => {
            if(poi.initialPoi && this._trackUserPath) {
              if(this._map.getSource('pathToTrack')) this._map.getSource('pathToTrack').setData(this._pathToTrack);
            }
          });
        } else if(!closeToPoint && poi.activeBackground && !poi.initialPoi) {
          poi.active = true;
        }
    });
  }

}
