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
  private _myLocation:any;

  // Does the user needs to follow a trail
  private _trackUserPath:boolean = false;
  private _walkedPath:any = {
    type: 'FeatureCollection',
    features: [{type: 'Feature', geometry: {type: 'LineString',coordinates: []}}]
  };

  // Should the app trigger when you are at location
  private _triggerOnPoi:boolean = false;
  private _pois:any;
  private _distanceToPoi:number;

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
    let mapZoom:number = 20;
    this._map = new mapboxgl.Map({
      style: mapStyle,
      center: [4.86, 52.356],
      zoom: mapZoom,
      minZoom: mapZoom,
      maxZoom: mapZoom,
      container: 'modalmap',
      pitch: 50
    })
    .on('movestart', (e) => {
      this.updateNavigator(this._myLocation);
    })
    .once('styledata', () => {
      if(!this._map.getSource('walkedPath')) this.addPathToMap("walkedPath", this._walkedPath, '#03A9F4', 12);
    });
  }

  addControlsToMap() {
    const vm = this; // Need this bc 'this' will be overwritten in the 'geolocate' event
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
    })
    .on('geolocate', (e) => {
      if(vm._triggerOnPoi) vm.checkPoiRange(e.coords);
      if(vm._trackUserPath) vm.updatePathOnMap(e.coords);

      this._myLocation = e.coords;
      vm.updateNavigator(e.coords);
      vm.updatePositionToPoi(e.coords);

    });

    this._map.addControl(geolocate, 'bottom-right');
  }

  addPointsOfInterest(pois) {
    pois.forEach(poi => {
      if(poi.active !== true) return;
      var el = document.createElement('div');
      el.className = 'poi__'+poi.markerLabel;
      new mapboxgl.Marker(el)
      .setLngLat([poi.coords.longitude, poi.coords.latitude])
      .addTo(this._map);
    });
  }

  addPathToMap(id, path, color, width) {
    this._map.addSource(id, { type: 'geojson', data: path });
    this._map.addLayer({
      id: id,
      source: id,
      type: "line",
      "paint": { "line-color": color, "line-width": width },
      "layout": { "line-join": "round", "line-cap": "round" },
    });
  }

  updatePathOnMap(coords) {
    this._walkedPath.features[0].geometry.coordinates.push([coords.longitude, coords.latitude]);
    // Update the walked path
    if(this._map.getSource('walkedPath')) this._map.getSource('walkedPath').setData(this._walkedPath);
  }

  checkPoiRange(coords) {
    this._pois.forEach(poi => {

        let closeToPoint = this.geolocationService.closeToPoint(coords,poi.coords,poi.range);

        if(closeToPoint && poi.active) {
          poi.active = !poi.active;
          let modal = this.modalCtrl.create(NarrativeModal, {narrativeFile: poi.narrativeFile});
          modal.present();
          modal.onDidDismiss(() => {
            if(poi.pathToNextPoi && this._trackUserPath) {
              // Reset the walked path and show the path to walk
              this._walkedPath.features[0].geometry.coordinates = [];

              if(poi.poisToActivate) {
                poi.poisToActivate.forEach(poiToActivate => {
                    const poi = this._pois.find(poi => poi.id === poiToActivate);

                    poi.active = true;
                    this.addPointsOfInterest([poi]);
                });
              }
            }
          });
        }
    });
  }


  updateNavigator(coords) {
    if(!coords) return;

    const poi = this._pois.find(poi => poi.active === true);

    if(!poi) return;

    const bearing = this.geolocationService.getBearing(coords.latitude, coords.longitude, poi.coords.latitude, poi.coords.longitude);
    const compass:any = document.querySelectorAll('.compass__arrow')[0];

    if(compass) compass.style.transform = 'rotate('+Math.round(bearing - this._map.getBearing())+'deg)';
  }

  updatePositionToPoi(coords) {
    if(!coords) return;

    const poi = this._pois.find(poi => poi.active === true);

    if(!poi) return;

    const distance = this.geolocationService.distanceToPoint(coords, poi.coords);

    this._distanceToPoi = distance * 1000; // convert to meters
  }
}
