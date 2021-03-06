import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';

import { Constants } from '../../lib/constants';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../lib/geolocation';

import { OutroModal } from '../modals/outro/outro';
import { NarrativeModal } from '../modals/narrative/narrative';

import { NativeAudio } from '@ionic-native/native-audio';


@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {

  public _map:any;
  private _myLocation:any;

  private _trackUserPath:boolean = false;
  private _walkedPath:any = {
    type: 'FeatureCollection',
    features: [{type: 'Feature', geometry: {type: 'LineString',coordinates: []}}]
  };

  private _geojson:any;
  private _triggerOnPoi:boolean = false;
  private _distanceToPoi:number = 0;
  private _activePoi:any;
  private _gamesCompleted:number = 0;

  constructor(
    private modalCtrl: ModalController,
    private params: NavParams,
    private geolocation: Geolocation,
    private geolocationService: GeolocationService,
    private nativeAudio: NativeAudio
  ) {
  }

  ngOnInit() {
    this.displayMap();
    this.addControlsToMap();
    this._trackUserPath = this.params.get('trackUserPath') ? true : false;
    this._triggerOnPoi = this.params.get('triggerOnPoi') ? true : false;
    this._geojson = Constants.VONDELPARK_ROUTE;
    // Add pois to map
    if(this._geojson) this.addPointsOfInterest(this._geojson);
  }

  displayMap() {
    mapboxgl.accessToken = Constants.ACCESS_TOKEN;
    let mapStyle:any = Constants.MAP_STYLE;
    const mapZoom:number = 19;
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
      // center: [4.86, 52.356],
      center: [4.916087, 52.346300],
      zoom: mapZoom,
      // minZoom: mapZoom  - 1,
      // maxZoom: mapZoom + 1,
      container: 'modalmap',
      pitch: 40
    })
    .on('move', (e) => {
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
      console.log(true);
      if(vm._triggerOnPoi) vm.checkPoiRange(e.coords);
      // if(vm._trackUserPath) vm.updatePathOnMap(e.coords);

      this._myLocation = e.coords;
      vm.updateNavigator(e.coords);
    });

    this._map.addControl(geolocate, 'bottom-right');
  }

  addPointsOfInterest(geojson) {
    geojson.features.forEach(marker => {
      if(marker.properties.active !== true && this._trackUserPath) return;
      if(!this._trackUserPath && !marker.properties.inFreeRoam) return;
      if(!this._trackUserPath) marker.properties.active = true;
      var el = document.createElement('div');
      el.className = 'poi__'+marker.properties.markerLabel;
      new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      // .setPopup(new mapboxgl.Popup({ offset: 25})
      // .setHTML('<h3>' + marker.properties.title + '</h3>'))
      .addTo(this._map);

      this.selectMarkerOnClick(marker, document.querySelectorAll('.poi__'+marker.properties.markerLabel)[0]);
      if(marker.properties.sound) this.addSound(marker.properties.id, marker.properties.sound, marker.properties.soundRange)
    });
  }

  selectMarkerOnClick(marker, element) {
    element.addEventListener('click', () => {
      if(!this._trackUserPath) {
        this._activePoi = marker;
        this.updateNavigator(this._myLocation);
      }
    });
  }

  addSound(id:string, file:string, range:number) {
    for(var i = 1; i<=5; i++) {
      this.nativeAudio.preloadComplex((id + '_' + 20*i), file, (0.20 * i), 1, 0);
    }
  }

  makeSound(distance:number, id:string, range:number) {
    // Calculate the volume
    let volumeRange:number = distance * 100 / range;
    let volume:number = 0;
    if(volumeRange <=20) {
      volume = 100;
    } else if(volumeRange <=40) {
      volume = 80
    } else if(volumeRange <=60) {
      volume = 60
    } else if(volumeRange <=80) {
      volume = 40
    } else {
      volume = 20
    }

    this.nativeAudio.play(id+'_'+volume);
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
    this._geojson.features.forEach(marker => {

        if(marker.properties.active && marker.properties.sound) {
          let distance = this.geolocationService.distanceToPoint(coords, marker.properties.coords);
          if(distance * 1000 < marker.properties.soundRange) {
            this.makeSound(distance * 1000, marker.properties.id, marker.properties.soundRange);
          }
        }
        let closeToPoint = this.geolocationService.closeToPoint(coords,marker.properties.coords,marker.properties.range);

        if(closeToPoint && marker.properties.active) {
          marker.properties.active = false;
          let modal = this.modalCtrl.create(NarrativeModal, {narrativeFile: marker.properties.narrativeFile, gameType: this._trackUserPath ? 1 : 2});
          modal.present();
          modal.onDidDismiss(() => {
            this._map.resize();
            this._gamesCompleted++;
            const finishModal = this.modalCtrl.create(OutroModal);
            if(this._trackUserPath && this._gamesCompleted === 6) {
              finishModal.present();
            } else if(!this._trackUserPath && this._gamesCompleted == 4) {
              finishModal.present();
            }
            if(this._trackUserPath && marker.properties.poisToActivate) {
                marker.properties.poisToActivate.forEach(poiToActivate => {
                  const poi = this._geojson.features.find(feature => feature.properties.id === poiToActivate);
                  if(!poi) return;

                  poi.properties.active = true;
                  this._activePoi = poi;
                  this.updateNavigator(this._myLocation);
                  this.addPointsOfInterest(this._geojson);
              });
            }
          });
        }
    });
  }


  updateNavigator(coords) {
    if(!coords || !this._activePoi) return;

    const mapBearing = this._map.getBearing();
    const bearingToPoi = this.geolocationService.getBearing(coords.latitude, coords.longitude, this._activePoi.properties.coords.latitude, this._activePoi.properties.coords.longitude);
    const compass:any = document.querySelectorAll('.compass__arrow')[0];
    const compassBackground:any = document.querySelectorAll('.compass__background')[0];

    if(compass) compass.style.transform = 'rotate('+Math.round(bearingToPoi - mapBearing)+'deg)';
    if(compassBackground) compassBackground.style.transform = 'rotate('+Math.round(-mapBearing)+'deg)';

    this.updatePositionToPoi(coords);
  }

  updatePositionToPoi(coords) {
    if(!coords || !this._activePoi) return;

    const distance = this.geolocationService.distanceToPoint(coords, this._activePoi.properties.coords);

    this._distanceToPoi = distance * 1000; // convert to meters
  }
}
