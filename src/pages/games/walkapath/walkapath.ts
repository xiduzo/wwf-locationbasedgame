import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import { Geolocation } from '@ionic-native/geolocation';
import { GeolocationService } from '../../../lib/geolocation';

import { Constants } from '../../../lib/constants';


@Component({
  selector: 'walk-a-path',
  templateUrl: 'walkapath.html'
})
export class WalkAPathGame {

  public _map:any;
  public _myLocation:any;

  private _markers:any = [
    {
      name: '1',
      coords: { latitude: 52.35728298035498, longitude: 4.868045762863176 },
      geoCoords: [4.868045762863176, 52.35728298035498]
    },
    {
      name: '2',
      coords: { latitude: 52.35728298035498, longitude: 4.868303254928605 },
      geoCoords: [4.868303254928605, 52.35728298035498]
    },
    {
      name: '3',
      coords: { latitude: 52.35706984780121, longitude: 4.8680511272812055 },
      geoCoords: [4.8680511272812055, 52.35706984780121]
    },
    {
      name: '4',
      coords: { latitude: 52.35729688026843, longitude: 4.867766813125627 },
      geoCoords: [4.867766813125627, 52.35729688026843]
    },
    {
      name: '5',
      coords: { latitude: 52.357452095671675, longitude: 4.868032351818101 },
      geoCoords: [4.868032351818101, 52.357452095671675]
    },
  ];
  private _activeMarkerNumber:number = 0
  private _activeMarker:any = this._markers[this._activeMarkerNumber];

  constructor(
    private geolocation: Geolocation,
    private geolocationService: GeolocationService,
    private viewCtrl: ViewController
  ) {
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((position) => {
      this._myLocation = position.coords;
      this.displayMap();
      this.addControlsToMap();
      this.addMarkerToMap(this._activeMarker);
    });
  }

  displayMap() {
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
    this._map = new mapboxgl.Map({
      style: mapStyle,
      center: [this._myLocation.longitude, this._myLocation.latitude],
      zoom: mapZoom,
      minZoom: mapZoom,
      maxZoom: mapZoom,
      container: 'walkapathmap'
    })
    .on('move', (e) => {
      this.setMarkerOpacity();
      this.setCompassRotation();
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  addControlsToMap() {
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
    })
    .on('geolocate', (e) => {
      this._myLocation = e.coords;
      this.setMarkerOpacity();
      this.isMarkerInRange();
    });

    this._map.addControl(geolocate, 'bottom-right');
  }

  addMarkerToMap(marker) {
    var el = document.createElement('div');
    el.className = 'opacity__100 marker marker__'+marker.name;
    new mapboxgl.Marker(el)
    .setLngLat(marker.geoCoords)
    .addTo(this._map);
  }

  setMarkerOpacity() {
    // If the user is within 5 meter just show the marker
    let mapBearing = this._map.getBearing();
    const element = document.querySelectorAll('.marker__'+this._activeMarker.name)[0];
    const range = this.geolocationService.distanceToPoint(this._myLocation, this._activeMarker.coords);


    const bearing = this.geolocationService.getBearing(this._myLocation.latitude, this._myLocation.longitude, this._activeMarker.coords.latitude, this._activeMarker.coords.longitude);
    if(mapBearing < 0) mapBearing = 180 + (180+mapBearing);

    if((bearing-10) < mapBearing && (bearing+10) > mapBearing) {
      element.classList.add('opacity__0');
    } else {
      if(!element) return;
      if(element.classList.contains('opacity__0')) element.classList.remove('opacity__0');
    }
  }

  setCompassRotation() {
    const bearing = this._map.getBearing();

    const compass:any = document.querySelectorAll('.compass__walkapath')[0];
    if(compass) compass.style.transform = 'rotate('+Math.round(bearing)+'deg)';
  }

  isMarkerInRange() {
    const inRange = this.geolocationService.closeToPoint(this._myLocation, this._activeMarker.coords, 5);

    if(inRange) {
      const element = document.querySelectorAll('.marker__'+this._activeMarker.name)[0];
      if(element) {
        element.classList.add('opacity__0');
        element.classList.remove('opacity__100');
        element.classList.add('done');

        if(this._markers[this._activeMarkerNumber + 1]) {
          this._activeMarkerNumber++;
          this._activeMarker = this._markers[this._activeMarkerNumber];
          this.addMarkerToMap(this._activeMarker);
        } else {
          this.closeModal();
          console.log('done');
        }
      };
    }
  }

}
